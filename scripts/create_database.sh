#!/bin/bash
# Create database tables in Supabase
set -e

echo "🚀 Creating database tables..."
cd "$(dirname "$0")/../backend"

if [ ! -f "../.env" ]; then
    echo "❌ Error: .env file not found in project root"
    exit 1
fi

echo "📦 Installing dependencies..."
pip install -q -r requirements.txt

echo "🔧 Running migrations..."
alembic upgrade head

echo ""
echo "✅ Database tables created successfully!"
echo ""
echo "Created tables:"
echo "  ✓ devices"
echo "  ✓ plans"
echo "  ✓ reading_units"
echo "  ✓ feedback"
echo ""
echo "You can now start the API with:"
echo "  cd backend && PYTHONPATH=. uvicorn app.main:app --reload"
