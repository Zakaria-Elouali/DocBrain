# app/config.py
from pydantic_settings import BaseSettings
import logging.config
import os

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "DocBrain PDF Processor API"
    SPRING_BOOT_CALLBACK_URL: str = "http://localhost:8080/api/documents/process/callback"
    MODEL_PATH: str = "D:/Coding/DocBrain Project/AI model/Meta-Llama-3-8B-Instruct"
    # MODEL_PATH: str = "D:\Coding\DocBrain Project\AI model\Meta-Llama-3-8B-Instruct"

    # Logging settings
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "pdf_service.log"

    # API-first approach settings
    USE_API_FIRST: bool = True

    # Google Gemini API settings
    GEMINI_API_KEY: str = ""  # Will be loaded from .env file
    GEMINI_API_MODEL: str = "gemini-2.0-flash"  # Default Gemini model
    GEMINI_API_URL: str = "https://generativelanguage.googleapis.com/v1beta/models/"

    # Hugging Face API settings (fallback)
    HF_API_TOKEN: str = ""  # Will be loaded from .env file
    HF_API_MODEL: str = "Qwen/Qwen3-235B-A22B"  # Default model ID for Hugging Face API
    HF_API_URL: str = "https://api-inference.huggingface.co/models/"

    # Additional settings
    USE_LOCAL_MODEL: bool = False  # Can be overridden by environment variable

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        case_sensitive = False  # Environment variables are case-insensitive

settings = Settings()


# Ensure log directory exists
log_dir = os.path.dirname(settings.LOG_FILE)
if log_dir and not os.path.exists(log_dir):
    os.makedirs(log_dir)

# Logging configuration
LOGGING_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'message_flow': {
            'format': '>>> MESSAGE FLOW: {levelname} {asctime} - {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': settings.LOG_FILE,
            'formatter': 'verbose',
        },
        'flow_console': {
            'class': 'logging.StreamHandler',
            'formatter': 'message_flow',
        },
        'flow_file': {
            'class': 'logging.FileHandler',
            'filename': 'message_flow.log',
            'formatter': 'message_flow',
        },
    },
    'loggers': {
        'message_flow': {
            'handlers': ['flow_console', 'flow_file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': settings.LOG_LEVEL,
    },
}

# Apply logging configuration
logging.config.dictConfig(LOGGING_CONFIG)

# Create a logger for the application
logger = logging.getLogger(__name__)
logger.info(f"Started {settings.PROJECT_NAME}")

# Create a logger for message flow tracking
flow_logger = logging.getLogger("message_flow")
flow_logger.info(f"Application started - {settings.PROJECT_NAME}")