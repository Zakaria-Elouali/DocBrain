"""
Test script for API-first approach with local model fallback using Hugging Face InferenceClient.

This script tests the API-first approach by:
1. Setting up a ModelService with API enabled
2. Testing with a valid API token
3. Testing with an invalid API token (should fall back to local)
4. Testing with API disabled (force local model)

Usage:
    python test_api_fallback.py --api-token=your_token
"""

import argparse
import asyncio
import logging
from app.services.model_service import ModelService
from app.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_api_first_approach(api_token=None, force_local=False):
    """Test the API-first approach with different configurations"""

    # Save original settings
    original_use_api = settings.USE_API_FIRST
    original_api_token = settings.HF_API_TOKEN

    try:
        # Apply test settings
        if api_token:
            settings.HF_API_TOKEN = api_token
            logger.info(f"Using provided API token: {api_token[:4]}...")

        if force_local:
            settings.USE_API_FIRST = False
            logger.info("Forcing local model (API disabled)")
        else:
            settings.USE_API_FIRST = True
            logger.info("API-first approach enabled")

        # Initialize model service
        logger.info("Initializing ModelService...")
        model_service = ModelService()

        # Test document processing
        logger.info("\n\n--- Testing document processing ---")
        test_text = """
        DocBrain AI is a document processing service that analyzes PDF documents
        and provides summaries, keywords, and chat capabilities based on document content.
        It now supports an API-first approach with local model fallback.
        """

        result = await model_service.process_document(test_text)
        logger.info(f"Summary: {result['summary'][:100]}...")
        logger.info(f"Keywords: {result['keywords']}")

        # Test chat response
        logger.info("\n\n--- Testing chat response ---")
        chat_result = await model_service.generate_chat_response(
            document=[test_text],
            user_message="What is DocBrain AI?",
            conversation_history=[]
        )
        logger.info(f"Chat response: {chat_result[:100]}...")

        return True

    except Exception as e:
        logger.error(f"Test failed: {str(e)}")
        return False
    finally:
        # Restore original settings
        settings.USE_API_FIRST = original_use_api
        settings.HF_API_TOKEN = original_api_token



async def run_tests(api_token=None):
    """Run all test scenarios"""

    # Test 1: API-first with token
    logger.info("\n\n=== TEST 1: API-first with token ===")
    await test_api_first_approach(api_token=api_token)

    # Test 2: API-first with invalid token (should fall back to local)
    logger.info("\n\n=== TEST 2: API-first with invalid token (fallback) ===")
    await test_api_first_approach(api_token="invalid_token")

    # Test 3: Force local model
    logger.info("\n\n=== TEST 3: Force local model ===")
    await test_api_first_approach(api_token=api_token, force_local=True)

if __name__ == "__main__":
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description="Test API-first approach with InferenceClient")
    parser.add_argument("--api-token", type=str, help="Hugging Face API token")
    args = parser.parse_args()

    # Run tests
    asyncio.run(run_tests(api_token=args.api_token))
