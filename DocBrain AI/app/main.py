# app/main.py
from fastapi import FastAPI
from app.api.routes import router as api_router
from app.config import settings, logger

# Check for environment variable overrides
import os

# Override USE_API_FIRST if specified in environment
if os.environ.get("USE_LOCAL_MODEL", "").lower() in ("true", "1", "yes"):
    logger.info("Environment override: Using local model only (API disabled)")
    settings.USE_API_FIRST = False
else:
    logger.info("Using API-first approach with local model fallback")

# Override API token if specified in environment
if "HF_API_TOKEN" in os.environ and os.environ["HF_API_TOKEN"]:
    logger.info("Using API token from environment variable")
    settings.HF_API_TOKEN = os.environ["HF_API_TOKEN"]

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.include_router(api_router, prefix=settings.API_V1_STR)