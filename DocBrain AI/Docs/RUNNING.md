# Running DocBrain AI

This document provides instructions on how to run the DocBrain AI application with different configurations.

## Prerequisites

- Python 3.8 or higher
- Required Python packages installed (see requirements.txt)
- Local model files (if using local model)
- Hugging Face API token (if using API model)

## Running Options

There are several ways to run the DocBrain AI application:

### 1. Using the Provided Scripts

#### For Windows:

- **Default Mode (API-first with fallback)**: `run_app.bat`
- **Local Model Only**: `run_local_model.bat`
- **API Model Only**: Edit `run_api_model.bat` to set your API token, then run it

#### For Linux/macOS:

- **Default Mode (API-first with fallback)**: `./run_app.sh`
- **Local Model Only**: `./run_local_model.sh`
- **API Model Only**: Edit `run_api_model.sh` to set your API token, then run it

Make sure to make the scripts executable on Linux/macOS:
```bash
chmod +x run_app.sh run_local_model.sh run_api_model.sh
```

### 2. Using Environment Variables

You can set the following environment variables before running the application:

- `USE_LOCAL_MODEL`: Set to "true" to force using the local model
- `HF_API_TOKEN`: Your Hugging Face API token
- `HF_API_MODEL`: The model ID to use with the API (default: "Qwen/Qwen3-235B-A22B")
- `HF_API_URL`: The base URL for API requests

#### Example (Windows):
```batch
set USE_LOCAL_MODEL=false
set HF_API_TOKEN=your_token_here
set HF_API_MODEL=Qwen/Qwen3-235B-A22B
uvicorn app.main:app --reload
```

#### Example (Linux/macOS):
```bash
export USE_LOCAL_MODEL=false
export HF_API_TOKEN=your_token_here
export HF_API_MODEL=Qwen/Qwen3-235B-A22B
uvicorn app.main:app --reload
```

## Troubleshooting

### Common Issues:

1. **Application fails to start**: Make sure you have all the required dependencies installed.

2. **Local model fails to load**: Check that the model path in `app/config.py` is correct.

3. **API calls fail**: Verify that your API token is valid and that you have access to the specified model.

4. **Message flow logging**: Check the `message_flow.log` file for detailed information about the message flow between components.

## Monitoring

The application includes enhanced logging to help you monitor the message flow:

- **Standard logs**: Available in the console and in `pdf_service.log`
- **Message flow logs**: Available in the console and in `message_flow.log`

The message flow logs are prefixed with `>>> MESSAGE FLOW:` to make them easy to identify.
