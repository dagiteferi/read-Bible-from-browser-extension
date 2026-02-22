# Quick Start - Create Database Tables

## Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## Step 2: Test Connection (Optional)

```bash
cd backend
PYTHONPATH=. python test_connection.py
```

## Step 3: Create Tables

**Option A: Use the script**
```bash
./scripts/create_database.sh
```

**Option B: Manual**
```bash
cd backend
alembic upgrade head
```

## Step 4: Verify Tables Created

You can check in Supabase dashboard or run:
```bash
cd backend
PYTHONPATH=. python -c "from app.core.database import engine; from sqlalchemy import inspect; print([t for t in inspect(engine.sync_engine).get_table_names()])"
```

## Step 5: Start API

```bash
cd backend
PYTHONPATH=. uvicorn app.main:app --reload
```

Visit: http://localhost:8000/health

---

## Troubleshooting

**If connection fails:**
1. Check `.env` has correct `DATABASE_URL`
2. Password with `@` must be URL encoded as `%40`
3. Ensure Supabase database is running
4. Check firewall/network allows connection

**If migrations fail:**
- Make sure you're in `backend/` directory
- Check `alembic.ini` exists
- Verify `alembic/versions/001_initial_schema.py` exists
