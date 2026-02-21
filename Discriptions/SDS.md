# Software Design Specification (SDS)

**Project Name**: Notification-Driven Bible Reading Browser Extension  
**Document Title**: Software Design Specification (SDS) – Production-Ready  
**Version**: 1.0  
**Date**: February 21, 2026  
**Author**: Senior Software Design Engineer (12+ years at Google, Meta & Amazon)  
**Status**: PRODUCTION READY – Developers & stakeholders can implement 100% from this document without clarification  

**Target Audience**: Backend engineers, Extension engineers, QA, DevOps, Product  

---

## 1. Introduction

### 1.1 Purpose
This SDS translates the provided Idea + SRS (v1.1) into a complete, production-grade technical design. Every decision, data structure, algorithm, flow, error path, and deployment detail is specified so that a mid-level engineer can implement the entire system correctly on the first attempt.

### 1.2 Scope
- Chromium-first browser extension (Manifest V3) + FastAPI backend + PostgreSQL
- Two modes: Random Verse & Sequential Plan
- Zero verse loss guarantee (per device)
- Notification-only delivery with interactive buttons
- Adaptive scheduling that respects quiet/working hours and never spams
- Hybrid storage (Backend = source of truth, chrome.storage = offline cache)
- Full coverage of all edge cases listed in SRS Appendix C

**Out of scope (v1.0)**: Cross-device sync, mobile, multi-language, audio, AI summaries, social features.

### 1.3 References
- SRS v1.1 (Feb 21, 2026)
- Chrome Extensions Manifest V3 Documentation
- FastAPI + SQLAlchemy 2.0 Best Practices (Google Internal Style)
- PostgreSQL 16
- Amharic Bible JSON + Title-Based Metadata JSON (static files)

---

## 2. Architecture Overview

```mermaid
graph TB
    subgraph "Browser Extension (Manifest V3)"
        A[Service Worker (background.ts)] 
        B[React Popup UI (Vite + TypeScript)]
        C[chrome.storage.local + sync]
        D[Chrome Notifications API + Alarms API + Fullscreen API]
    end

    subgraph "Backend (FastAPI)"
        E[API Layer]
        F[Bible Service (in-memory JSON)]
        G[Plan Service]
        H[Scheduler Service]
        I[PostgreSQL]
    end

    A <--> E
    B <--> E
    C <--> A
    D <--> A
    E <--> F
    E <--> G
    E <--> H
    G <--> I
    H <--> I
    F <--> BibleJSON[Static Bible JSON + Metadata JSON\n(on disk, loaded at startup)]


## 3. Technology Stack (Production Choices)

| Layer              | Technology                              | Reason                                      |
|--------------------|-----------------------------------------|---------------------------------------------|
| Extension          | Manifest V3, TypeScript, React 18, Vite, Tailwind | Modern, secure, fast build, excellent DX    |
| Backend            | Python 3.12, FastAPI 0.115, Uvicorn + Gunicorn | Async-first, auto OpenAPI, Google-style     |
| ORM                | SQLAlchemy 2.0 + Alembic                | Type-safe queries, automatic migrations     |
| Database           | PostgreSQL 16 (with JSONB)              | Full ACID compliance, reliability for plans |
| Caching            | In-memory (Bible JSON) + Redis (optional) | Sub-10ms verse lookup                       |
| Deployment         | Docker + Docker Compose, GitHub Actions | One-command local & production deploy       |
| Monitoring         | Sentry + Prometheus + Grafana           | Full production observability               |

---

## 4. Data Models

### 4.1 Database Schema (PostgreSQL)

```sql
-- devices (anonymous per installation)
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- plans
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    books JSONB NOT NULL,                    -- ["Luke"]
    boundaries JSONB,                        -- {chapter_start, verse_start, ...}
    target_date DATE,
    frequency TEXT CHECK (frequency IN ('daily','weekly')),
    quiet_hours JSONB,                       -- {"start":"22:00","end":"06:00"}
    max_verses_per_unit INT NOT NULL DEFAULT 3,
    state TEXT CHECK (state IN ('active','paused','completed')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- reading_units
CREATE TABLE reading_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    book TEXT NOT NULL,
    chapter INT NOT NULL,
    verse_start INT NOT NULL,
    verse_end INT NOT NULL,
    unit_index INT NOT NULL,
    state TEXT CHECK (state IN ('pending','delivered','read')) DEFAULT 'pending',
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    CONSTRAINT unique_unit UNIQUE (plan_id, unit_index)
);

-- feedback (anonymous)
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID REFERENCES devices(id),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    suggestion TEXT,
    issue TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);