#!/usr/bin/env python3
"""
Test script for Google Gemini API integration
Run this script to test if your Gemini API key is working correctly
"""

import os
import sys
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_gemini_api():
    """Test the Gemini API with a simple request"""
    
    # Get API key from environment
    api_key = os.getenv('GEMINI_API_KEY')

    if not api_key or not api_key.strip():
        print("❌ Error: GEMINI_API_KEY not found or not set properly")
        print("Please set your Gemini API key in the .env file or environment variables")
        print("Example: GEMINI_API_KEY=your_actual_api_key_here")
        print("\nTo set up:")
        print("1. Copy .env.example to .env")
        print("2. Edit .env and add your Gemini API key")
        print("3. Run this test again")
        return False
    
    # Prepare the test request
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": "Explain how AI works in a few words"
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 100,
            "topP": 0.8,
            "topK": 10
        }
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    print("🔄 Testing Gemini API connection...")
    print(f"API Key: {api_key[:10]}...{api_key[-4:]}")  # Show partial key for verification
    
    try:
        # Make the API request
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            
            # Extract the response text
            if "candidates" in result and len(result["candidates"]) > 0:
                candidate = result["candidates"][0]
                if "content" in candidate and "parts" in candidate["content"]:
                    parts = candidate["content"]["parts"]
                    if len(parts) > 0 and "text" in parts[0]:
                        generated_text = parts[0]["text"]
                        print("✅ Gemini API test successful!")
                        print(f"Response: {generated_text}")
                        return True
            
            print("❌ Unexpected response format from Gemini API")
            print(f"Response: {json.dumps(result, indent=2)}")
            return False
            
        else:
            print(f"❌ API request failed with status code: {response.status_code}")
            print(f"Error response: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ API request timed out after 30 seconds")
        return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {str(e)}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return False

def main():
    """Main function to run the test"""
    print("=" * 50)
    print("DocBrain AI - Gemini API Test")
    print("=" * 50)
    
    success = test_gemini_api()
    
    print("\n" + "=" * 50)
    if success:
        print("✅ Test completed successfully!")
        print("Your Gemini API integration is working correctly.")
        print("You can now run DocBrain AI with Gemini API support.")
    else:
        print("❌ Test failed!")
        print("Please check your API key and try again.")
        print("\nTroubleshooting:")
        print("1. Make sure you have a valid Gemini API key")
        print("2. Check that the key is set in your .env file")
        print("3. Verify your internet connection")
        print("4. Ensure you have API quota remaining")
    
    print("=" * 50)
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
