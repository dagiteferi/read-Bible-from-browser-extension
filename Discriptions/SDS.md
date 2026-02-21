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