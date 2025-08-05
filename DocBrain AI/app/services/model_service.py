# app/services/model_service.py
from typing import List, Dict, Any, Optional
import json
import requests

from huggingface_hub import InferenceClient, InferenceTimeoutError

from transformers import AutoModelForCausalLM, AutoTokenizer, AutoConfig
import torch
import logging
from app.config import settings, flow_logger
from transformers import BitsAndBytesConfig

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ModelService:
    def __init__(self):
        try:
            logger.info("Checking GPU availability...")
            if torch.cuda.is_available():
                logger.info(f"GPU detected: {torch.cuda.get_device_name(0)}")
                logger.info(f"Total GPU memory: {torch.cuda.get_device_properties(0).total_memory / 1024 ** 3:.2f} GB")
                logger.info(f"Available GPU memory: {torch.cuda.memory_allocated(0) / 1024 ** 3:.2f} GB used")
            else:
                logger.warning("No GPU detected! Running on CPU.")

            logger.info("Initializing model service...")

            # Initialize model and tokenizer as None
            self.model = None
            self.tokenizer = None

            # Store model path for later use
            self.model_path = settings.MODEL_PATH

            # API configuration
            self.use_api_first = settings.USE_API_FIRST

            # Gemini API configuration
            self.gemini_api_key = settings.GEMINI_API_KEY
            self.gemini_api_model = settings.GEMINI_API_MODEL
            self.gemini_api_url = f"{settings.GEMINI_API_URL}{settings.GEMINI_API_MODEL}:generateContent"

            # Hugging Face API configuration (fallback)
            self.hf_api_token = settings.HF_API_TOKEN
            self.hf_api_model = settings.HF_API_MODEL
            self.hf_api_url = f"{settings.HF_API_URL}{settings.HF_API_MODEL}"

            # Check if we should use API-first approach
            if self.use_api_first:
                logger.info("Using API-first approach. Local model will be loaded only if needed.")
                if self.gemini_api_key and self.gemini_api_key.strip():
                    logger.info(f"Primary API: Google Gemini ({self.gemini_api_model})")
                elif self.hf_api_token and self.hf_api_token.strip():
                    logger.info(f"Primary API: Hugging Face ({self.hf_api_model})")
                else:
                    logger.warning("No API tokens provided. Will use local model only.")
            else:
                logger.info("Using local model approach.")
                self._load_local_model()

        except Exception as e:
            logger.error(f"Error initializing model service: {str(e)}")
            raise

    def _load_local_model(self):
        """Load the local model if it hasn't been loaded yet"""
        if self.model is not None and self.tokenizer is not None:
            return  # Model already loaded

        try:
            logger.info(f"Loading local model from: {self.model_path}")

            # Load tokenizer
            logger.info("Loading tokenizer...")
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.model_path,
                trust_remote_code=True,
                local_files_only=True
            )

            # Configure quantization
            quantization_config = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_compute_dtype=torch.float16
            )

            # Load model
            logger.info("Loading model...")
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_path,
                device_map="cuda:0" if torch.cuda.is_available() else "cpu",
                torch_dtype=torch.float16,
                trust_remote_code=True,
                local_files_only=True,
                quantization_config=quantization_config
            )

            # Verify model device
            logger.info(f"Model is on device: {next(self.model.parameters()).device}")
            logger.info("Local model loaded successfully!")

        except Exception as e:
            logger.error(f"Error loading local model: {str(e)}")
            raise

    def _call_gemini_api(self, prompt: str, max_new_tokens: int = 800, temperature: float = 0.7) -> Optional[str]:
        """Call the Google Gemini API for text generation"""
        if not self.gemini_api_key or not self.gemini_api_key.strip():
            logger.warning("No Gemini API key provided. Skipping Gemini API call.")
            flow_logger.warning("Gemini API call skipped - No API key provided")
            return None

        try:
            logger.info(f"Calling Gemini API for model: {self.gemini_api_model}")
            flow_logger.info(f"Sending request to Gemini API - Model: {self.gemini_api_model}")

            # Prepare the request payload according to Gemini API format
            payload = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": temperature,
                    "maxOutputTokens": max_new_tokens,
                    "topP": 0.8,
                    "topK": 10
                }
            }

            headers = {
                "Content-Type": "application/json"
            }

            # Make the API call
            url = f"{self.gemini_api_url}?key={self.gemini_api_key}"
            response = requests.post(url, headers=headers, json=payload, timeout=60)

            if response.status_code == 200:
                result = response.json()

                # Extract the generated text from Gemini response
                if "candidates" in result and len(result["candidates"]) > 0:
                    candidate = result["candidates"][0]
                    if "content" in candidate and "parts" in candidate["content"]:
                        parts = candidate["content"]["parts"]
                        if len(parts) > 0 and "text" in parts[0]:
                            generated_text = parts[0]["text"]
                            flow_logger.info("Received response from Gemini API")
                            return generated_text

                logger.warning("Unexpected Gemini API response format")
                flow_logger.warning("Gemini API returned unexpected response format")
                return None
            else:
                logger.error(f"Gemini API request failed with status {response.status_code}: {response.text}")
                flow_logger.error(f"Gemini API request failed: {response.status_code}")
                return None

        except requests.exceptions.Timeout:
            logger.error("Gemini API request timed out")
            flow_logger.error("Gemini API request timed out after 60 seconds")
            return None
        except Exception as e:
            logger.error(f"Error calling Gemini API: {str(e)}")
            flow_logger.error(f"Gemini API request failed: {str(e)}")
            return None

    def _call_api(self, prompt: str, max_new_tokens: int = 800, temperature: float = 0.7) -> Optional[str]:
        """Call APIs with priority: Gemini first, then Hugging Face fallback"""

        # Try Gemini API first
        if self.gemini_api_key and self.gemini_api_key.strip():
            logger.info("Attempting Gemini API call...")
            gemini_response = self._call_gemini_api(prompt, max_new_tokens, temperature)
            if gemini_response:
                return gemini_response
            else:
                logger.warning("Gemini API failed, falling back to Hugging Face API...")
                flow_logger.warning("Gemini API failed, trying Hugging Face API fallback")

        # Fallback to Hugging Face API
        return self._call_huggingface_api(prompt, max_new_tokens, temperature)

    def _call_huggingface_api(self, prompt: str, max_new_tokens: int = 800, temperature: float = 0.7) -> Optional[str]:
        """Call the Hugging Face API for text generation using InferenceClient"""
        if not self.hf_api_token:
            logger.warning("No Hugging Face API token provided. Skipping HF API call.")
            flow_logger.warning("HF API call skipped - No API token provided")
            return None

        try:
            logger.info(f"Calling Hugging Face API for model: {self.hf_api_model}")
            flow_logger.info(f"Sending request to Hugging Face API - Model: {self.hf_api_model}")

            # Create InferenceClient
            client = InferenceClient(
                model=self.hf_api_model,
                token=self.hf_api_token
            )

            # For chat-based models, format as messages
            if "chat" in prompt.lower() or "conversation" in prompt.lower():
                # Extract user message from prompt
                user_message = prompt
                if "User:" in prompt and "Assistant:" in prompt:
                    # Try to extract the last user message
                    parts = prompt.split("User:")
                    if len(parts) > 1:
                        user_message = parts[-1].split("Assistant:")[0].strip()

                # Format as chat messages
                messages = [
                    {
                        "role": "user",
                        "content": user_message
                    }
                ]

                try:
                    # Try to use the chat completions API
                    logger.info("Using chat completions API")
                    flow_logger.info("Using chat completions API endpoint")

                    response = client.chat.completions.create(
                        messages=messages,
                        temperature=temperature,
                        max_tokens=max_new_tokens,
                        top_p=0.7
                    )

                    # Extract the response content
                    flow_logger.info("Received response from API - Chat completions")
                    return response.choices[0].message.content
                except Exception as chat_error:
                    # If chat completions fails, fall back to text generation
                    logger.warning(f"Chat completions API failed: {str(chat_error)}. Falling back to text generation.")
                    flow_logger.warning(f"Chat completions API failed: {str(chat_error)}. Falling back to text generation.")

                    flow_logger.info("Using text generation API endpoint (fallback)")
                    response = client.text_generation(
                        prompt,
                        max_new_tokens=max_new_tokens,
                        temperature=temperature,
                        return_full_text=False
                    )
                    flow_logger.info("Received response from API - Text generation (fallback)")
                    return response
            else:
                # For standard text generation
                logger.info("Using text generation API")
                flow_logger.info("Using text generation API endpoint")

                response = client.text_generation(
                    prompt,
                    max_new_tokens=max_new_tokens,
                    temperature=temperature,
                    return_full_text=False
                )

                flow_logger.info("Received response from API - Text generation")
                return response

        except InferenceTimeoutError as e:
            logger.error(f"API request timed out: {str(e)}")
            flow_logger.error(f"API request timed out after 60 seconds")
            return None
        except Exception as e:
            logger.error(f"Error calling API: {str(e)}")
            flow_logger.error(f"API request failed: {str(e)}")
            return None

    def _ensure_model_loaded(self):
        """Ensure the local model is loaded if needed"""
        if self.model is None or self.tokenizer is None:
            logger.info("Local model not loaded yet. Loading now...")
            self._load_local_model()

    async def process_document(self, text: str) -> dict:
        """
        Process document text with the model to generate summary, keywords, and analysis
        """
        try:
            # Log GPU memory before processing if available
            if torch.cuda.is_available():
                logger.info(f"GPU memory before processing: {torch.cuda.memory_allocated(0) / 1024 ** 3:.2f} GB used")

            # Truncate text more aggressively for initial testing
            max_input_length = 2048  # Increased from original 512
            truncated_text = text[:max_input_length]

            # Create prompt for document analysis with explicit instructions for tags/keywords
            prompt = f"""
                        Analyze this document and provide the following:
                        1. A concise summary (max 200 words)
                        2. A list of 5-10 keywords or tags that best represent the document content
                        3. A brief analysis of the main points

                        Document:
                        {truncated_text}

                        Format your response like this:
                        SUMMARY: [your summary]
                        KEYWORDS: [comma-separated list of keywords]
                        ANALYSIS: [your analysis]
                        """

            logger.info("Generating document analysis...")

            # Try API first if enabled
            response = None
            if self.use_api_first:
                logger.info("Attempting to use API for document analysis...")
                flow_logger.info("Starting document analysis with API-first approach")
                api_response = self._call_api(prompt, max_new_tokens=800, temperature=0.7)
                if api_response:
                    logger.info("Successfully received API response")
                    flow_logger.info("Document analysis completed successfully using API")
                    response = api_response
                else:
                    logger.warning("API call failed or returned empty response. Falling back to local model.")
                    flow_logger.warning("API call failed for document analysis. Falling back to local model.")

            # If API failed or not enabled, use local model
            if response is None:
                # Ensure local model is loaded
                flow_logger.info("Loading local model for document analysis")
                self._ensure_model_loaded()

                # Process with local model
                flow_logger.info("Processing document with local model")
                inputs = self.tokenizer(
                    prompt,
                    return_tensors="pt",
                    truncation=True,
                    max_length=max_input_length
                ).to(self.model.device)

                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=800,  # Increased for more comprehensive analysis
                    num_return_sequences=1,
                    temperature=0.7,
                    do_sample=True,
                    pad_token_id=self.tokenizer.eos_token_id
                )

                response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
                flow_logger.info("Local model generated response for document analysis")

                # Extract the generated part (remove the prompt)
                response = response[len(prompt):]

                # Clear CUDA cache immediately after generation
                if torch.cuda.is_available():
                    torch.cuda.empty_cache()
                    logger.info(f"GPU memory after cache clear: {torch.cuda.memory_allocated(0) / 1024 ** 3:.2f} GB used")

            # Parse the response to extract summary, keywords, and analysis
            summary = ""
            keywords = []
            analysis = ""

            # Extract sections from the response
            if "SUMMARY:" in response and "KEYWORDS:" in response:
                summary_part = response.split("SUMMARY:")[1].split("KEYWORDS:")[0].strip()
                summary = summary_part

                if "ANALYSIS:" in response:
                    keywords_part = response.split("KEYWORDS:")[1].split("ANALYSIS:")[0].strip()
                    analysis_part = response.split("ANALYSIS:")[1].strip()
                    keywords = [k.strip() for k in keywords_part.split(",")]
                    analysis = analysis_part
                else:
                    # If ANALYSIS is missing, assume everything after KEYWORDS is the keywords
                    keywords_part = response.split("KEYWORDS:")[1].strip()
                    keywords = [k.strip() for k in keywords_part.split(",")]
            else:
                # Fallback if the model didn't follow the format
                summary = response[:200].strip()
                analysis = response.strip()
                keywords = ["document", "analysis"]  # Default keywords

            processed_results = {
                "summary": summary,
                "keywords": keywords,
                "analysis": analysis,
            }

            return processed_results

        except Exception as e:
            logger.error(f"Error processing document: {str(e)}")
            raise Exception(f"Error processing document with model: {str(e)}")

    async def generate_chat_response(
            self,
            document: List[str],
            user_message: str,
            conversation_history: List[dict]
    ) -> str:
        try:
            # Combine document chunks into context
            context = "\n".join(document)

            # Format conversation history
            history_text = ""
            for msg in conversation_history:
                prefix = "User:" if msg["role"] == "user" else "Assistant:"
                history_text += f"{prefix} {msg['content']}\n"

            # Create prompt
            prompt = f"""
                        Context from document:
                        {context}

                        Previous conversation:
                        {history_text}

                        User: {user_message}
                        Assistant: """

            # Try API first if enabled
            response = None
            if self.use_api_first:
                logger.info("Attempting to use API for chat response...")
                flow_logger.info("Starting chat response generation with API-first approach")
                api_response = self._call_api(prompt, max_new_tokens=512, temperature=0.7)
                if api_response:
                    logger.info("Successfully received API response for chat")
                    flow_logger.info("Chat response generated successfully using API")
                    response = api_response
                else:
                    logger.warning("API call failed or returned empty response. Falling back to local model for chat.")
                    flow_logger.warning("API call failed for chat response. Falling back to local model.")

            # If API failed or not enabled, use local model
            if response is None:
                # Ensure local model is loaded
                flow_logger.info("Loading local model for chat response")
                self._ensure_model_loaded()

                # Generate response using the local model
                flow_logger.info("Processing chat with local model")
                inputs = self.tokenizer(
                    prompt,
                    return_tensors="pt",
                    truncation=True,
                    max_length=2048
                ).to(self.model.device)

                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=512,
                    num_return_sequences=1,
                    temperature=0.7,
                    do_sample=True,
                    pad_token_id=self.tokenizer.eos_token_id
                )

                response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
                flow_logger.info("Local model generated response for chat")

            # Extract only the assistant's response
            if "Assistant:" in response:
                response = response.split("Assistant: ")[-1].strip()

            return response

        except Exception as e:
            logger.error(f"Error generating chat response: {str(e)}")
            raise Exception(f"Failed to generate chat response: {str(e)}")