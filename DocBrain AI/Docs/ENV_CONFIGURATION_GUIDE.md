# Environment Configuration Guide for DocBrain AI

## How to Import Variables from .env to Config

This guide explains how to properly configure environment variables in DocBrain AI using `.env` files and Pydantic Settings.

## 1. Understanding the Configuration System

DocBrain AI uses **Pydantic Settings** which automatically loads environment variables from:
1. System environment variables
2. `.env` file in the project root
3. Default values defined in the config class

### Priority Order (highest to lowest):
1. **System Environment Variables** (e.g., `export GEMINI_API_KEY=your_key`)
2. **`.env` file** (e.g., `GEMINI_API_KEY=your_key`)
3. **Default values** in `app/config.py`

## 2. Current Configuration Structure

```python
# app/config.py
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Google Gemini API settings
    GEMINI_API_KEY: str = ""  # Will be loaded from .env file
    GEMINI_API_MODEL: str = "gemini-2.0-flash"
    GEMINI_API_URL: str = "https://generativelanguage.googleapis.com/v1beta/models/"

    # Hugging Face API settings (fallback)
    HF_API_TOKEN: str = ""  # Will be loaded from .env file
    HF_API_MODEL: str = "Qwen/Qwen3-235B-A22B"

    # Additional settings
    USE_API_FIRST: bool = True
    USE_LOCAL_MODEL: bool = False

    class Config:
        env_file = "../.env"
        env_file_encoding = 'utf-8'
        case_sensitive = False  # Environment variables are case-insensitive


settings = Settings()
```

## 3. Setting Up Your .env File

### Step 1: Create .env file
```bash
# Copy the example file
cp .env.example .env
```

### Step 2: Edit .env file
```bash
# .env file content
GEMINI_API_KEY=your_actual_gemini_api_key_here
HF_API_TOKEN=your_huggingface_token_here
USE_API_FIRST=true
USE_LOCAL_MODEL=false
MODEL_PATH=D:/Coding/DocBrain Project/AI model/Meta-Llama-3-8B-Instruct
SPRING_BOOT_CALLBACK_URL=http://localhost:8080/api/documents/process/callback
LOG_LEVEL=INFO
```

## 4. How Variables Are Loaded

### Automatic Loading
Pydantic Settings automatically:
1. Reads the `.env` file
2. Matches environment variable names to class attributes
3. Converts types automatically (str, bool, int, etc.)
4. Uses default values if environment variables are not set

### Example Loading Process:
```python
# When you create Settings(), it automatically:
settings = Settings()

# 1. Looks for GEMINI_API_KEY in environment variables
# 2. If not found, looks in .env file
# 3. If not found, uses default value ""
print(settings.GEMINI_API_KEY)  # Your API key from .env
```

## 5. Environment Variable Types

### String Variables
```python
# In config.py
GEMINI_API_KEY: str = ""

# In .env
GEMINI_API_KEY=your_api_key_here
```

### Boolean Variables
```python
# In config.py
USE_API_FIRST: bool = True

# In .env (any of these work)
USE_API_FIRST=true
USE_API_FIRST=True
USE_API_FIRST=1
USE_API_FIRST=yes
```

### Integer Variables
```python
# In config.py
MAX_TOKENS: int = 800

# In .env
MAX_TOKENS=1000
```

## 6. Advanced Configuration Options

### Case Sensitivity
```python
class Config:
    case_sensitive = False  # GEMINI_API_KEY = gemini_api_key
```

### Multiple .env Files
```python
class Config:
    env_file = [".env", ".env.local", ".env.production"]
```

### Environment Prefix
```python
class Config:
    env_prefix = "DOCBRAIN_"  # Looks for DOCBRAIN_GEMINI_API_KEY
```

## 7. Accessing Configuration in Your Code

### In Services
```python
# app/services/model_service.py
from app.config import settings

class ModelService:
    def __init__(self):
        self.gemini_api_key = settings.GEMINI_API_KEY
        self.use_api_first = settings.USE_API_FIRST
```

### Direct Access
```python
from app.config import settings

# Access any configuration value
api_key = settings.GEMINI_API_KEY
model_path = settings.MODEL_PATH
```

## 8. Validation and Error Handling

### Required Variables
```python
from pydantic import Field

class Settings(BaseSettings):
    GEMINI_API_KEY: str = Field(..., description="Required Gemini API key")
    # ... means required, will raise error if not provided
```

### Custom Validation
```python
from pydantic import validator

class Settings(BaseSettings):
    GEMINI_API_KEY: str = ""
    
    @validator('GEMINI_API_KEY')
    def validate_api_key(cls, v):
        if v and len(v) < 10:
            raise ValueError('API key too short')
        return v
```

## 9. Testing Your Configuration

### Method 1: Use the Test Script
```bash
python test_gemini_api.py
```

### Method 2: Python Console
```python
from app.config import settings
print(f"Gemini API Key: {settings.GEMINI_API_KEY[:10]}...")
print(f"Use API First: {settings.USE_API_FIRST}")
```

### Method 3: Check in Application Logs
When you start the application, check the logs for:
```
INFO: Primary API: Google Gemini (gemini-2.0-flash)
```

## 10. Common Issues and Solutions

### Issue 1: Variables Not Loading
**Problem**: Environment variables not being read
**Solution**: 
- Check `.env` file is in project root
- Ensure no spaces around `=` in `.env` file
- Verify variable names match exactly

### Issue 2: Boolean Values Not Working
**Problem**: `USE_API_FIRST=false` still shows as `True`
**Solution**: Use lowercase: `USE_API_FIRST=false` or `USE_API_FIRST=0`

### Issue 3: API Key Not Found
**Problem**: "No API key provided" error
**Solution**: 
- Check `.env` file exists and has correct key
- Verify no extra quotes: `GEMINI_API_KEY=abc123` not `GEMINI_API_KEY="abc123"`

## 11. Security Best Practices

### Never Commit .env Files
```bash
# Add to .gitignore
.env
.env.local
.env.production
```

### Use Different .env Files for Different Environments
```bash
.env.development
.env.staging
.env.production
```

### Validate Required Variables
```python
class Settings(BaseSettings):
    GEMINI_API_KEY: str = Field(..., min_length=1)
```

## 12. Example Complete Setup

### 1. Create .env file:
```bash
GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
HF_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
USE_API_FIRST=true
LOG_LEVEL=INFO
```

### 2. Verify configuration:
```python
from app.config import settings
print(f"✅ Gemini API Key: {'Set' if settings.GEMINI_API_KEY else 'Not Set'}")
print(f"✅ Use API First: {settings.USE_API_FIRST}")
```

### 3. Run application:
```bash
uvicorn app.main:app --reload
```

This configuration system ensures your API keys and settings are properly loaded from environment variables while maintaining security and flexibility.
