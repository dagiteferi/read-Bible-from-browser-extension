#!/bin/bash
# Create DB and run migrations. Run from project root.
set -e
cd "$(dirname "$0")/.."

echo "Starting PostgreSQL..."
docker compose up -d postgres

echo "Waiting for PostgreSQL..."
sleep 5

echo "Running migrations..."
cd backend && alembic upgrade head

echo "Done. DB ready."
