#!/bin/bash

# DocBrain AI Runner Script
# This script provides options to run DocBrain AI with different configurations

# Function to display help
show_help() {
    echo "DocBrain AI Runner Script"
    echo ""
    echo "Usage: ./run_app.sh [options]"
    echo ""
    echo "Options:"
    echo "  --local         Force using local model only"
    echo "  --api TOKEN     Use API with the specified token"
    echo "  --help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./run_app.sh                  # Run with default settings (API-first with fallback)"
    echo "  ./run_app.sh --local          # Run with local model only"
    echo "  ./run_app.sh --api your_token # Run with specified API token"
    echo ""
}

# Parse command line arguments
if [ "$1" == "--help" ]; then
    show_help
    exit 0
elif [ "$1" == "--local" ]; then
    echo "Running with local model only..."
    export USE_LOCAL_MODEL="true"
elif [ "$1" == "--api" ] && [ -n "$2" ]; then
    echo "Running with API token: $2"
    export HF_API_TOKEN="$2"
else
    echo "Running with default settings (API-first with fallback)..."
fi

# Start the application
uvicorn app.main:app --reload
