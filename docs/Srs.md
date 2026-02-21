# Software Requirements Specification (SRS)

## Document Information

- **Project Name**: Notification-Driven Bible Reading Browser Extension
- **Document Title**: Software Requirements Specification (SRS)
- **Version**: 1.1
- **Date**: February 21, 2026
- **Author**: Dagmawi
- **Approval**: Approved (with revisions incorporated)
- **Revision History**:

| Version | Date          | Author       | Changes                                                                 |
|---------|---------------|--------------|-------------------------------------------------------------------------|
| 1.0     | 2026-02-21    | Dagmawi      | Initial draft based on provided system description and requirements.    |
| 1.1     | 2026-02-21    | Dagmawi      | Incorporated improvements: Expanded use cases, fixed JSON schemas, added edge cases and traceability matrix, added detailed FRs for full coverage, cleaned formatting, ensured 100% alignment with original idea. |

- **Distribution List**: Development Team, Product Owner, QA Team

## Table of Contents

1. [Introduction](#1-introduction)  
   1.1 [Purpose](#11-purpose)  
   1.2 [Scope](#12-scope)  
   1.3 [Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)  
   1.4 [References](#14-references)  
   1.5 [Overview](#15-overview)  

2. [Overall Description](#2-overall-description)  
   2.1 [Product Perspective](#21-product-perspective)  
   2.2 [Product Functions](#22-product-functions)  
   2.3 [User Classes and Characteristics](#23-user-classes-and-characteristics)  
   2.4 [Operating Environment](#24-operating-environment)  
   2.5 [Design and Implementation Constraints](#25-design-and-implementation-constraints)  
   2.6 [Assumptions and Dependencies](#26-assumptions-and-dependencies)  

3. [External Interface Requirements](#3-external-interface-requirements)  
   3.1 [User Interfaces](#31-user-interfaces)  
   3.2 [Hardware Interfaces](#32-hardware-interfaces)  
   3.3 [Software Interfaces](#33-software-interfaces)  
   3.4 [Communications Interfaces](#34-communications-interfaces)  

4. [System Features](#4-system-features)  
   4.1 [Random Verse Mode](#41-random-verse-mode)  
   4.2 [Sequential Plan Mode](#42-sequential-plan-mode)  
   4.3 [Notification Delivery and Interaction](#43-notification-delivery-and-interaction)  
   4.4 [Adaptive Scheduling](#44-adaptive-scheduling)  
   4.5 [Progress Tracking and Feedback](#45-progress-tracking-and-feedback)  
   4.6 [Data Management](#46-data-management)  
   4.7 [Notification Settings](#47-notification-settings)  
   4.8 [Environment Detection](#48-environment-detection)  

5. [Other Non-Functional Requirements](#5-other-non-functional-requirements)  
   5.1 [Performance Requirements](#51-performance-requirements)  
   5.2 [Safety Requirements](#52-safety-requirements)  
   5.3 [Security Requirements](#53-security-requirements)  
   5.4 [Software Quality Attributes](#54-software-quality-attributes)  
   5.5 [Business Rules](#55-business-rules)  

6. [Other Requirements](#6-other-requirements)  
   6.1 [Installation and Deployment](#61-installation-and-deployment)  
   6.2 [Privacy and Safety Constraints](#62-privacy-and-safety-constraints)  
   6.3 [Future Feature Roadmap](#63-future-feature-roadmap)  

7. [Appendix A: Use Cases](#appendix-a-use-cases)  

8. [Appendix B: Data Models](#appendix-b-data-models)  

9. [Appendix C: Edge Cases](#appendix-c-edge-cases)  

10. [Appendix D: Traceability Matrix](#appendix-d-traceability-matrix)  

## 1. Introduction

### 1.1 Purpose
This SRS document provides a comprehensive, unambiguous specification of the functional and non-functional requirements for the Notification-Driven Bible Reading Browser Extension. It ensures that developers can implement the system without further clarification, adhering to best practices for reliability, user respect, and zero verse loss. The document is structured to facilitate traceability, testing, and maintenance, drawing from enterprise standards at Google, Meta, and Amazon. All requirements are detailed sufficiently for 100% coding implementation based solely on this SRS.

### 1.2 Scope
The system comprises:
- A browser extension for user interaction and notification delivery.
- A backend service (FastAPI) for Bible data exposure and plan management.
- Integration with static Amharic Bible JSON datasets.

Key features include notification-only Scripture delivery, adaptive scheduling, progress tracking, random and sequential modes, interruption handling, and user feedback. Out-of-scope: Cross-device sync, mobile support, multi-language Bibles, social features.

### 1.3 Definitions, Acronyms, and Abbreviations
- **Verse**: A single unit of Bible text from the JSON dataset.
- **Reading Unit**: A contiguous group of verses in one notification, including book name, chapter/verse range, text payload, unit index, and state (pending, delivered, read).
- **Plan**: User-defined sequential reading schedule.
- **JSON Dataset**: Static file with book, chapter, verse, text (Amharic).
- **Metadata JSON**: File with book names, chapter/verse counts, thematic tags.
- **API**: Application Programming Interface.
- **UI**: User Interface.
- **SRS**: Software Requirements Specification.
- **Working Hours**: User-defined periods for notification delivery.
- **Quiet Hours**: User-defined periods to avoid notifications.

### 1.4 References
- IEEE Std 830-1998: Recommended Practice for Software Requirements Specifications.
- Bible JSON Dataset (Amharic).
- Title-Based Metadata JSON.
- Chrome Extensions API Documentation.
- FastAPI Documentation.
- React Documentation.

### 1.5 Overview
Section 2 provides a high-level description. Section 3 details interfaces. Section 4 specifies features with prioritized requirements (MUST, SHOULD, MAY) and acceptance criteria for verifiability. Sections 5-6 cover non-functional and other requirements. Appendices include detailed use cases, models, edge cases, and traceability for full implementation guidance.

## 2. Overall Description

### 2.1 Product Perspective
This system addresses deficiencies in existing Bible tools by providing a notification-first, data-driven, interruption-resilient platform that delivers Scripture from a static JSON dataset, guaranteeing completion, consistency, and user respect without duplication, skipping, or spam.

### 2.2 Product Functions
- Deliver verses exclusively via browser notifications.
- Support random verse mode for inspiration and sequential plan mode for structured reading.
- Adapt dynamically to interruptions like browser closure, PC sleep, user absence, presentations, or quiet hours.
- Track reading progress, provide statistics, and allow user feedback.
- Manage Bible data via backend API with local caching for offline resilience.

### 2.3 User Classes and Characteristics
- **End Users**: Adults seeking inspirational or structured Bible reading; assumed to have basic browser and tech literacy. Users are treated as adults without moralizing.
- No administrative users; system is self-service.

### 2.4 Operating Environment
- Browsers: MUST support Chromium-based (Chrome, Edge); SHOULD support Firefox, Brave for maximum compatibility.
- Backend: Python with FastAPI on standard servers (e.g., AWS, Heroku).
- Network: Required for initial sync and backend access; system MUST handle offline scenarios via local storage.
- Hardware: Standard PC; no mobile support.

### 2.5 Design and Implementation Constraints
- Extension: JavaScript with React for UI components, Manifest V3 compliance.
- Backend: RESTful FastAPI endpoints, read-only access to JSON data.
- Standards: HTTPS for communications, JSON for data exchange.
- Permissions: Browser must request notifications, storage, alarms, and fullscreen detection.
- Frameworks: Use FastAPI for backend, React for extension popup UI.

### 2.6 Assumptions and Dependencies
- Bible JSON datasets are static, authoritative, complete, and error-free.
- Users grant necessary browser permissions.
- No external APIs for Bible content; all data from local JSON files exposed via backend.
- Zero verse loss guaranteed per device only; no cross-device sync.
- User-defined working/quiet hours for scheduling.
- Dependencies: Chrome Extensions API, FastAPI, React.

## 3. External Interface Requirements

### 3.1 User Interfaces
- **Extension Popup UI (React-based)**: Interactive interface for:
  - Plan selection (books, chapters, verses, target date/duration).
  - Settings (notification frequency, sounds, quiet/working hours, max verses per notification).
  - Progress dashboard (completed verses, stats, habits).
  - Feedback form (ratings, suggestions, issue reports).
- **Notifications**: Browser-native, displaying verse text, book/chapter/range, and interactive buttons (Read/Mark as Read, Snooze, Dismiss, Copy to Clipboard, Read More, Add Note).

### 3.2 Hardware Interfaces
N/A (software-only).

### 3.3 Software Interfaces
- **Backend API (RESTful, implemented in FastAPI)**:

| Endpoint | Method | Description | Parameters | Response | Acceptance Criteria |
|----------|--------|-------------|------------|----------|---------------------|
| /books | GET | List all book names from metadata. | None | JSON array of strings. | Returns complete list in <100ms. |
| /metadata/{book} | GET | Get chapter/verse counts and tags for a book. | Book name (path). | JSON object with counts and tags. | Validates book exists; 404 if not. |
| /verses/{book}/{chapter}/{start}/{end} | GET | Fetch verse texts in range. | Path params: book, chapter, start/end verse. | JSON array of verses. | Handles contiguous ranges; no modification. |
| /plan/create | POST | Create new plan. | JSON body: books (array), boundaries (object), target_date (date), frequency (enum), quiet_hours (object), max_verses (int). | Plan ID (string). | Precomputes units using metadata; stores in backend. |
| /plan/{id} | GET | Get plan state including units and read statuses. | Plan ID (path). | JSON plan object with units. | Syncs with local if discrepancies. |
| /plan/{id}/update | PUT | Modify plan (pause/extend/modify). | Plan ID (path), JSON body: updates. | Updated plan JSON. | Recalculates units dynamically; preserves read states. |
| /unit/{id}/read | PUT | Mark unit as read. | Unit ID (path). | Success message. | Advances plan; syncs backend/local. |
| /plan/calculate/{id} | GET | Recalculate remaining verses/time/windows. | Plan ID (path). | JSON with remaining verses, time, adjusted unit sizes. | Used for adaptive scheduling. |
| /feedback/submit | POST | Submit user feedback. | JSON body: rating (int), suggestion (string), issue (string). | Success message. | Stores anonymously for future improvements. |

- **Local Storage**: Use chrome.storage.sync for caching plans, units, read states, and settings to handle offline periods.

### 3.4 Communications Interfaces
- All API calls over HTTPS.
- Browser alarms API for scheduling notifications.
- Fullscreen API for detecting presentation mode.

## 4. System Features

Requirements are prefixed with FR (Functional Requirement). Priority: MUST (mandatory for core functionality), SHOULD (recommended for usability), MAY (optional for enhancements). Each includes acceptance criteria for developer guidance.

### 4.1 Random Verse Mode
FR-4.1.1: MUST deliver a single random verse per notification, selected from JSON dataset and filtered by user-chosen themes (from metadata tags). Acceptance: Random selection uniform; filters applied correctly.  
FR-4.1.2: SHOULD adapt content tone based on time of day (e.g., encouraging in morning). Acceptance: Use system time to categorize (morning/afternoon/evening).  
FR-4.1.3: MUST not track progress or require confirmation. Acceptance: No state changes post-delivery.

### 4.2 Sequential Plan Mode
FR-4.2.1: MUST allow user selection of book(s), optional chapter/verse boundaries, target completion date/duration via popup UI. Acceptance: Validate selections against metadata; precompute total verses.  
FR-4.2.2: MUST deliver reading units sequentially, advancing only on explicit user confirmation (Mark as Read). Acceptance: Units never skipped/reordered/deleted until read.  
FR-4.2.3: SHOULD support pausing, extending, or modifying plans at any time. Acceptance: Modifications trigger backend recalculation; preserve completed units.

### 4.3 Notification Delivery and Interaction
FR-4.3.1: MUST enforce one active notification at a time, with no overlaps or replays of missed ones. Acceptance: Use browser notifications API; check for existing before showing.  
FR-4.3.2: MUST include interactive actions: Read/Mark as Read (advances plan), Snooze (postpones for user-defined duration), Dismiss (removes without advance), Copy to Clipboard, Read More (expands if multi-verse), Add Note (allows user annotation). Acceptance: Actions update states via API/local sync.  
FR-4.3.3: Pending units MUST wait silently during pauses, quiet hours, or interruptions. Acceptance: Queue in local storage; deliver in next valid window.

### 4.4 Adaptive Scheduling
FR-4.4.1: MUST continuously recalculate remaining verses (from metadata counts), remaining time to target, and allowed delivery windows (considering working/quiet hours). Acceptance: Backend endpoint handles; called on changes.  
FR-4.4.2: MUST compensate for missed time by increasing verses per unit, never increasing notification frequency. Acceptance: Respect user max_verses_per_unit; adjust dynamically.  
FR-4.4.3: SHOULD offer plan extension prompt if compensation exceeds limits. Acceptance: UI prompt in popup; auto-extend if user approves.

### 4.5 Progress Tracking and Feedback
FR-4.5.1: MUST display completed verses, reading statistics (e.g., habits, completion percentage) in popup UI. Acceptance: Fetch from backend/local; real-time sync.  
FR-4.5.2: SHOULD allow users to adjust reading goals mid-plan. Acceptance: Triggers update API; recalculates schedule.  
FR-4.5.3: MAY include mechanism for feedback on notifications (rating relevance, suggestions, reports). Acceptance: Submit via API; store for analysis without PII.

### 4.6 Data Management
FR-4.6.1: MUST use hybrid approach: Backend as source of truth for plans/sequences/read states; local storage for caching during offline. Acceptance: Auto-sync on reconnect; resolve conflicts by backend priority.  
FR-4.6.2: MUST ensure zero verse loss per device, with units stored persistently. Acceptance: Units mirrored locally; queued on closures/sleep.

### 4.7 Notification Settings
FR-4.7.1: MUST allow customization of notification sounds, quiet hours, working hours, and frequency (daily/weekly). Acceptance: Store in local; apply to scheduling.  
FR-4.7.2: SHOULD support max verses per notification limit. Acceptance: Used in compensation calculations.

### 4.8 Environment Detection
FR-4.8.1: MUST detect real-world interruptions: Browser/PC closure (queue units), sleep (resume on wake), fullscreen/presentation mode (pause delivery), user absence (via inactivity). Acceptance: Use browser APIs (visibility, fullscreen); minimal detection only.

## 5. Other Non-Functional Requirements

### 5.1 Performance Requirements
- API responses: MUST be <200ms (95th percentile).
- Notification rendering: MUST be <1s.
- Offline tolerance: MUST handle up to 24 hours; sync on reconnect.
- Scalability: Handle single-user loads; backend uptime 99.9%.

### 5.2 Safety Requirements
- Data integrity: MUST prevent verse skipping/duplication/reordering.
- User respect: MUST avoid spam; enforce quiet/working hours.

### 5.3 Security Requirements
- Authentication: MAY use optional device-based sessions (no user accounts).
- Data access: MUST be read-only for Bible JSON; no PII stored/collected.

### 5.4 Software Quality Attributes
- Reliability: MUST guarantee delivery exactly once per verse.
- Maintainability: Modular architecture; 80% code coverage in tests.
- Usability: Intuitive React UI; ARIA for accessibility.
- Portability: Browser-agnostic where feasible.

### 5.5 Business Rules
- Verse delivery: Exactly once, no loss.
- Compensation: Increase verse count per unit only.
- Progress: Advances on explicit confirmation only.

## 6. Other Requirements

### 6.1 Installation and Deployment
- Extension: MUST be publishable to Chrome Web Store; sideload for testing.
- Backend: Dockerized for easy deployment; e.g., on cloud providers.

### 6.2 Privacy and Safety Constraints
- MUST not scan page content, track keystrokes, profile behavior.
- MUST detect only minimal browser states (e.g., fullscreen, visibility).
- Bible data MUST remain backend-controlled or local.

### 6.3 Future Feature Roadmap
- Audio verse delivery.
- Multi-language Bible support.
- Cross-device sync.
- Advanced analytics.
- AI-derived summaries (not replacing Scripture).
- Exportable notes/history.
All MUST preserve privacy, Scripture integrity, user experience.

## Appendix A: Use Cases

| ID | Name | Actors | Preconditions | Steps | Postconditions | Exceptions |
|----|------|--------|---------------|-------|----------------|------------|
| UC-1 | Create Sequential Plan | User | Popup UI open. | 1. Select books/chapters/verses/target date. 2. Validate via metadata API. 3. Submit to /plan/create. 4. Store locally. | Plan ID returned; units precomputed. | Invalid range: UI alert; retry. |
| UC-2 | Deliver Notification | System | Unit pending; valid window. | 1. Check for active notifications. 2. Fetch verse text via API. 3. Render notification with actions. | Notification shown; state to delivered. | Quiet hours: Queue. |
| UC-3 | Handle Notification Action | User | Notification active. | 1. User selects action (e.g., Mark as Read). 2. Update state via /unit/read. 3. Sync local. | Plan advances; next unit queued. | Offline: Cache update; sync later. |
| UC-4 | Random Verse Delivery | System | Notification trigger (frequency). | 1. Filter by themes/time. 2. Random select via metadata. 3. Fetch text. 4. Notify. | Verse delivered; no state change. | No themes: Default random. |
| UC-5 | Adapt to Interruption | System | Detection of closure/sleep/fullscreen. | 1. Queue pending units locally. 2. On resume: Call /plan/calculate. 3. Adjust unit size. 4. Deliver. | No verse loss; compensated. | Long offline: Prompt extension on sync. |
| UC-6 | View Progress | User | Popup open. | 1. Fetch from /plan/{id}. 2. Sync local. 3. Display stats/completed. | UI updated. | Offline: Use local cache. |
| UC-7 | Modify Plan | User | Plan active; popup open. | 1. Update parameters. 2. Call /plan/update. 3. Recalculate units. 4. Sync local. | Updated schedule; preserved reads. | Conflicts (e.g., invalid date): Alert. |
| UC-8 | Submit Feedback | User | Feedback form open. | 1. Enter rating/suggestion. 2. Submit to /feedback/submit. | Feedback stored. | Offline: Queue; submit on sync. |
| UC-9 | Configure Settings | User | Popup open. | 1. Set frequency/sounds/quiet hours/max verses. 2. Store locally. 3. Apply to scheduler. | Settings persisted; scheduling updated. | Invalid input: Alert. |
| UC-10 | Handle Environment Detection | System | Ongoing monitoring. | 1. Detect fullscreen/visibility change. 2. Pause if in presentation. 3. Resume on exit. | Delivery adapted silently. | No detection: Default to queue. |

## Appendix B: Data Models

- **Reading Unit Schema** (JSON):

```json
{
  "book": "string",
  "chapter": "int",
  "verse_range": {"start": "int", "end": "int"},
  "text": "string",
  "index": "int",
  "state": "enum(pending, delivered, read)"
}
```

## Plan Schema (JSON):
```json

  {
  "id": "string",
  "user_id": "string (optional)",
  "books": ["array of strings"],
  "boundaries": {"chapter_start": "int", "verse_start": "int", "chapter_end": "int", "verse_end": "int"},
  "target_date": "date",
  "frequency": "enum(daily, weekly)",
  "quiet_hours": {"start": "time", "end": "time"},
  "max_verses_per_unit": "int",
  "units": ["array of Reading Units"],
  "state": "enum(active, paused)"

}
```

## Verse Schema (JSON, from dataset):
```json
{
  "book": "string",
  "chapter": "int",
  "verse": "int",
  "text": "string"
}
```

## Metadata Schema (JSON):
```json
{
  "book": "string",
  "chapter_count": "int",
  "verse_counts": ["array of ints per chapter"],
  "tags": ["array of strings (themes)"]
}
```

## Feedback Schema (JSON):
```json

 {
  "rating": "int (1-5)",
  "suggestion": "string",
  "issue": "string"

}
```
## Appendix C: Edge Cases

| Case ID | Description                                      | Expected Behavior                                                                 | Test Verification                                      |
|---------|--------------------------------------------------|-----------------------------------------------------------------------------------|--------------------------------------------------------|
| EC-1    | PC sleeps during working hours                   | Notifications queued; delivered on wake without loss                              | Simulate sleep; check queue and delivery               |
| EC-2    | Browser closed during delivery windows           | Pending verses queued locally; delivered with adjusted count on reopen            | Close/reopen browser; verify no skipping               |
| EC-3    | User modifies plan mid-way                       | Dynamically recalculate remaining verses/schedule; preserve read states           | Modify via UI; check API update and units              |
| EC-4    | Missed notifications stacking                    | Increase verses per unit; avoid overwhelming (respect max)                        | Simulate misses; verify compensation                   |
| EC-5    | Offline for extended period (>24h)               | Use local cache; sync on reconnect; prompt extension if target exceeded           | Disconnect; perform actions; reconnect and verify      |
| EC-6    | Invalid range selection in plan                  | Validate against metadata; alert user in UI                                       | Input invalid; check error handling                    |
| EC-7    | Quiet hours overlap with schedule                | Skip delivery; queue for next valid window                                        | Set overlapping hours; verify pause                    |
| EC-8    | Fullscreen/presentation mode detected            | Pause notifications; resume on exit                                               | Enter fullscreen; check no delivery                    |
| EC-9    | Max verses per notification exceeded in compensation | Prompt user to extend plan or adjust limits via UI                             | Simulate long miss; verify prompt                      |
| EC-10   | No themes selected in random mode                | Default to unfiltered random selection                                            | Remove themes; verify delivery                         |

## Appendix D: Traceability Matrix

| Req ID     | Feature Section | Use Case ID       | Edge Case ID          | Acceptance Criteria / Test Reference                                      |
|------------|-----------------|-------------------|-----------------------|---------------------------------------------------------------------------|
| FR-4.1.1   | 4.1             | UC-4              | EC-10                 | Uniform random; filters applied; test with mock metadata                  |
| FR-4.1.2   | 4.1             | UC-4              | N/A                   | Time-based categorization; unit test with mocked time                     |
| FR-4.1.3   | 4.1             | UC-4              | N/A                   | No state updates; integration test                                        |
| FR-4.2.1   | 4.2             | UC-1              | EC-6                  | Validation passes/fails; UI test                                          |
| FR-4.2.2   | 4.2             | UC-1, UC-3        | N/A                   | Sequential delivery; end-to-end test                                      |
| FR-4.2.3   | 4.2             | UC-7              | EC-3                  | Recalculation correct; preserve reads; API test                           |
| FR-4.3.1   | 4.3             | UC-2              | N/A                   | No overlaps; browser API mock test                                        |
| FR-4.3.2   | 4.3             | UC-3              | N/A                   | All actions functional; UI interaction test                               |
| FR-4.3.3   | 4.3             | UC-2, UC-5        | EC-7                  | Queue persists; resume test                                               |
| FR-4.4.1   | 4.4             | UC-5, UC-7        | EC-3                  | Accurate recalc; API unit test                                            |
| FR-4.4.2   | 4.4             | UC-5              | EC-1, EC-2, EC-4      | Verse count increases; frequency unchanged; math test                     |
| FR-4.4.3   | 4.4             | UC-5              | EC-9                  | Prompt shown; user approval extends; UI test                              |
| FR-4.5.1   | 4.5             | UC-6              | N/A                   | Stats accurate; sync test                                                 |
| FR-4.5.2   | 4.5             | UC-6              | N/A                   | Goals adjust; recalc triggers; integration test                           |
| FR-4.5.3   | 4.5             | UC-8              | N/A                   | Feedback submits; anonymous storage; API test                             |
| FR-4.6.1   | 4.6             | UC-5, UC-6        | EC-5                  | Hybrid sync; conflict resolution; offline test                            |
| FR-4.6.2   | 4.6             | UC-5              | EC-1, EC-4            | No loss verified; persistence test                                        |
| FR-4.7.1   | 4.7             | UC-9              | EC-7                  | Settings apply; scheduling test                                           |
| FR-4.7.2   | 4.7             | UC-9              | EC-9                  | Limits enforced; compensation test                                        |
| FR-4.8.1   | 4.8             | UC-10             | EC-8                  | Detection pauses; API mock test                                           |

