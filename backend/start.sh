#!/bin/bash
# VBS Production Management Platform - Backend Starter Script

echo "🚀 Starting VBS Production Management API..."
echo "======================================"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/Update dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt --quiet

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from example..."
    cp env.example .env 2>/dev/null || echo "No env.example found. Using defaults."
fi

# Start the server
echo "✅ Starting FastAPI server..."
echo "======================================"
echo "📍 API URL: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/api/docs"
echo "======================================"
echo ""

python3 main.py

