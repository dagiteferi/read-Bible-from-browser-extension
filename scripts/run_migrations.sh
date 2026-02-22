#!/bin/bash
# Run Alembic migrations against Supabase or configured database
set -e

echo "Running database migrations..."
cd "$(dirname "$0")/../backend"

# Check if .env exists
if [ ! -f "../.env" ]; then
    echo "Error: .env file not found in project root"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "venv" ] && [ ! -d "../venv" ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
fi

# Run migrations
echo "Running: alembic upgrade head"
alembic upgrade head

echo "✅ Migrations completed successfully!"
echo ""
echo "Tables created:"
echo "  - devices"
echo "  - plans"
echo "  - reading_units"
echo "  - feedback"
