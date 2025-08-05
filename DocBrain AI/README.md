# DocBrain AI

DocBrain AI is a document processing service that analyzes PDF documents and provides summaries, keywords, and chat capabilities based on document content.

## Features

- PDF text extraction
- Document summarization and keyword extraction
- Chat interface for document-based Q&A
- API-first approach with local model fallback
- Configurable via settings and command-line arguments

## Setup

1. Clone the repository

2. Install dependencies:

   ### Option 1: Using Conda (Recommended)

   ```bash
   # Create and activate the conda environment
   conda env create -f environment.yml
   conda activate docbrainLlama
   ```

   ### Option 2: Using the provided scripts

   **Windows:**
   ```
   install_dependencies.bat
   ```

   **Linux/macOS:**
   ```
   chmod +x install_dependencies.sh
   ./install_dependencies.sh
   ```

   ### Option 3: Manual installation
   ```
   pip install -r requirements.txt
   ```

3. Configure your local model path in `app/config.py` if needed (default path is already set)

## API-First Approach

DocBrain AI supports a multi-tier API approach with intelligent fallback:

1. **Primary**: Google Gemini API (gemini-2.0-flash) for high-quality text generation
2. **Secondary**: Hugging Face API fallback if Gemini fails
3. **Tertiary**: Local model if both APIs fail or aren't configured

### Google Gemini API Integration

DocBrain now uses Google's Gemini 2.0 Flash model as the primary API, which provides:

- State-of-the-art text generation capabilities
- Fast response times
- Cost-effective pricing
- Robust error handling and fallback mechanisms

### API Priority System

The system automatically tries APIs in this order:
1. **Gemini API** (if API key is configured)
2. **Hugging Face API** (if Gemini fails and HF token is available)
3. **Local Model** (if all APIs fail)

### Configuration Options

The application is pre-configured to use the API-first approach with a default API token. You can override these settings in several ways:

#### 1. Environment Variables

Set these environment variables to override the default settings:

```
# Google Gemini API (Primary)
GEMINI_API_KEY=your_gemini_api_key

# Hugging Face API (Fallback)
HF_API_TOKEN=your_huggingface_token

# To use local model only
USE_LOCAL_MODEL=true
```

#### 2. .env File

Create a `.env` file in the project root with your API keys:

```
# Copy from .env.example and update with your keys
GEMINI_API_KEY=your_actual_gemini_api_key_here
HF_API_TOKEN=your_huggingface_token_here
USE_API_FIRST=true
```

#### 3. Getting API Keys

**Google Gemini API:**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Copy the key and set it as `GEMINI_API_KEY`

**Hugging Face API (Fallback):**
1. Go to [Hugging Face](https://huggingface.co/settings/tokens)
2. Create a new token
3. Copy the token and set it as `HF_API_TOKEN`

#### 4. Shell Script (Linux/macOS)

Use the provided shell script with different options:

```
# Make executable (first time only)
chmod +x run_app.sh

# Run with default settings
./run_app.sh

# Run with local model only
./run_app.sh --local

# Run with specific API token
./run_app.sh --api your_token

# Show help
./run_app.sh --help
```

## Running the Application

### Default Method (Simplest)

Just run the application directly:

```
uvicorn app.main:app --reload
```

This will use the default settings from the config file (API-first with local model fallback).

### Using Environment Variables

You can override settings with environment variables:

#### Windows:
```
set USE_LOCAL_MODEL=true
uvicorn app.main:app --reload
```

#### Linux/macOS:
```
export USE_LOCAL_MODEL=true
uvicorn app.main:app --reload
```

### Using the Shell Script (Linux/macOS)

For Linux/macOS users, a shell script is provided:

```
./run_app.sh         # Run with default settings
./run_app.sh --local # Run with local model only
```

## Message Flow Logging

The application includes enhanced logging to track message flow between components:

- **Standard logs**: Available in the console and in `pdf_service.log`
- **Message flow logs**: Available in the console and in `message_flow.log`

The message flow logs are prefixed with `>>> MESSAGE FLOW:` to make them easy to identify.

## API Endpoints

- `POST /api/v1/process-pdf`: Process a PDF document
- `POST /api/v1/chat`: Chat with a processed document

## License

[MIT License](LICENSE)
