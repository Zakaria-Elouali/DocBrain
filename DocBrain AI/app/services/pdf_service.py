from fastapi import UploadFile
import PyPDF2
import re
from io import BytesIO
import requests
from app.config import logger, settings, flow_logger
from sentence_transformers import SentenceTransformer
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image


class PDFService:
    def __init__(self):
        try:
            # Load embedding model - can be any sentence-transformers model
            self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
            logger.info("Embedding model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading embedding model: {str(e)}")
            # Continue without embeddings if model fails to load
            self.embedding_model = None

    async def read_pdf(self, file: UploadFile) -> str:
        """
        Extract text from a PDF using PyPDF2, with OCR fallback.
        """
        try:
            contents = await file.read()
            pdf_file = BytesIO(contents)

            # Try extracting text using PyPDF2
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = ""

            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text

            # If text extraction fails, use OCR
            if not text.strip():
                logger.warning("PyPDF2 failed to extract text, switching to OCR...")
                text = self.read_pdf_with_ocr(contents)

            # Clean text: remove NULL bytes and non-printable characters
            clean_text = re.sub(r'[^\x20-\x7E]', '', text)

            return clean_text.strip()
        except Exception as e:
            raise Exception(f"Error reading PDF: {str(e)}")

    def read_pdf_with_ocr(self, pdf_bytes: bytes) -> str:
        """
        Convert PDF to images and extract text using Tesseract OCR.
        """
        try:
            images = convert_from_bytes(pdf_bytes)
            text = ""

            for image in images:
                text += pytesseract.image_to_string(image, lang="eng") + "\n"

            return text.strip()
        except Exception as e:
            raise Exception(f"OCR text extraction failed: {str(e)}")

    def extract_chunks(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> list:
        """
        Extract text chunks with overlap for better context preservation
        """
        chunks = []
        for i in range(0, len(text), chunk_size - overlap):
            # Get chunk with specified size
            chunk = text[i:i + chunk_size]

            # Skip empty chunks
            if not chunk.strip():
                continue

            chunks.append(chunk)

        return chunks

    def generate_embedding(self, text: str) -> str:
        """
        Generate text embedding using sentence transformer
        Returns embedding as a comma-separated string
        """
        if self.embedding_model is None:
            return None

        try:
            # Generate embedding
            embedding = self.embedding_model.encode(text)

            # Convert to comma-separated string
            embedding_str = ','.join([str(x) for x in embedding])

            return embedding_str
        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            return None

    def prepare_chunks_with_embeddings(self, text: str) -> list:
        """
        Extract chunks from text and generate embeddings for each chunk
        """
        # Extract chunks
        chunks = self.extract_chunks(text)

        # Process chunks and generate embeddings
        processed_chunks = []
        for i, chunk_text in enumerate(chunks):
            embedding = self.generate_embedding(chunk_text)

            processed_chunks.append({
                "chunkOrder": i,
                "content": chunk_text,
                "embedding": embedding
            })

        return processed_chunks

    async def send_results_to_spring(self, results: dict, documentId: int):
        try:
            headers = {
                "Content-Type": "application/json"
            }

            logger.info(f"Sending results to Spring Boot for document ID: {documentId}")
            logger.debug(f"Number of chunks: {len(results.get('chunks', []))}")
            flow_logger.info(f"Initiating HTTP POST to Spring Boot - URL: {settings.SPRING_BOOT_CALLBACK_URL}")
            flow_logger.info(f"Sending document data - ID: {documentId}, Chunks: {len(results.get('chunks', []))}, Summary length: {len(results.get('summary', ''))}")

            response = requests.post(
                settings.SPRING_BOOT_CALLBACK_URL,
                json=results,
                headers=headers
            )

            response.raise_for_status()
            logger.info(f"Successfully sent results for document ID: {documentId}")
            flow_logger.info(f"Spring Boot responded with status code: {response.status_code}")

            if response.text:
                try:
                    response_json = response.json()
                    flow_logger.info(f"Spring Boot response: {response_json}")
                    return response_json
                except Exception:
                    flow_logger.info(f"Spring Boot response (non-JSON): {response.text[:100]}...")
                    return response.text
            else:
                flow_logger.info("Spring Boot returned empty response")
                return {}

        except Exception as e:
            error_msg = f"Error sending results to Spring Boot: {str(e)}"
            logger.error(error_msg, exc_info=True)
            flow_logger.error(f"ERROR: Failed to send results to Spring Boot - {str(e)}")
            raise Exception(error_msg)

    # async def send_results_to_spring(self, results: dict, documentId: int):
    #     try:
    #         callback_data = {
    #             "documentId": documentId,
    #             "summary": results.get("summary", ""),
    #             "keywords": results.get("keywords", []),
    #             "analysis": results.get("analysis", "")
    #         }
    #
    #         headers = {
    #             "Content-Type": "application/json"
    #         }
    #
    #         logger.info(f"Sending callback to Spring Boot for document ID: {documentId}")
    #         logger.debug(f"Callback data: {callback_data}")
    #
    #         response = requests.post(
    #             settings.SPRING_BOOT_CALLBACK_URL,
    #             json=callback_data,
    #             headers=headers
    #         )
    #
    #         response.raise_for_status()
    #         logger.info(f"Successfully sent callback for document ID: {documentId}")
    #         return response.json()
    #
    #     except Exception as e:
    #         error_msg = f"Error sending results to Spring Boot: {str(e)}"
    #         logger.error(error_msg, exc_info=True)  # This will log the full stack trace
    #         raise Exception(error_msg)

    # --------------------chat with PDF -------------------------------------------
    # async def get_document_chunks(documentId: int) -> List[DocumentChunk]:
    #     try:
    #         # Connect to your database
    #         conn = await asyncpg.connect(settings.DATABASE_URL)
    #
    #         # Fetch document chunks
    #         chunks = await conn.fetch(
    #             """
    #             SELECT content, metadata
    #             FROM document_chunks
    #             WHERE documentId = $1
    #             ORDER BY chunk_index
    #             """,
    #             documentId
    #         )
    #
    #         await conn.close()
    #
    #         return [
    #             DocumentChunk(
    #                 content=chunk['content'],
    #                 metadata=chunk['metadata']
    #             )
    #             for chunk in chunks
    #         ]
    #     except Exception as e:
    #         logger.error(f"Error fetching document chunks: {str(e)}")
    #         raise Exception(f"Failed to fetch document chunks: {str(e)}")
    #
    # def format_conversation_history(history: List[dict]) -> List[Message]:
    #     formatted_history = []
    #     for message in history:
    #         formatted_history.append(
    #             Message(
    #                 role=message.get('role', 'user'),
    #                 content=message.get('content', '')
    #             )
    #         )
    #     return formatted_history