# Software Requirements Specification (SRS)

## Document Information

- **Project Name**: Notification-Driven Bible Reading Browser Extension
- **Document Title**: Software Requirements Specification(SRS)
- **Version**: 1.0
- **Date**: February 21, 2026
- **Author**: Dagmawi
- **Approval**: Pending stakeholder review
- **Revision History**:

| Version | Date          | Author       | Changes                                                                 |
|---------|---------------|--------------|-------------------------------------------------------------------------|
| 1.0     | 2026-02-21    | Dagmawi      | Initial draft based on provided system description and requirements.    |

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

5. [Other Non-Functional Requirements](#5-other-non-functional-requirements)  
   5.1 [Performance Requirements](#51-performance-requirements)  
   5.2 [Safety Requirements](#52-safety-requirements)  
   5.3 [Security Requirements](#53-security-requirements)  
   5.4 [Software Quality Attributes](#54-software-quality-attributes)  
   5.5 [Business Rules](#55-business-rules)  

6. [Other Requirements](#6-other-requirements)  
   6.1 [Installation and Deployment](#61-installation-and-deployment)  
   6.2 [Privacy and Safety Constraints](#62-privacy-and-safety-constraints)  

7. [Appendix A: Use Cases](#appendix-a-use-cases)  

8. [Appendix B: Data Models](#appendix-b-data-models)  

9. [Appendix C: Edge Cases](#appendix-c-edge-cases)  

10. [Appendix D: Traceability Matrix](#appendix-d-traceability-matrix)  

## 1. Introduction

### 1.1 Purpose
This SRS document provides a comprehensive, unambiguous specification of the functional and non-functional requirements for the Notification-Driven Bible Reading Browser Extension. It ensures that developers can implement the system without confusion, adhering to best practices for reliability, user respect, and zero verse loss. The document is structured to facilitate traceability, testing, and maintenance, drawing from enterprise standards.
### 1.2 Scope
The system comprises:
- A browser extension for user interaction and notification delivery.
- A backend service ```FastAPI ``` for Bible data exposure and plan management.
- Integration with static Amharic Bible JSON datasets.

Key features include notification-only Scripture delivery, adaptive scheduling, and progress tracking. Out-of-scope: ```Cross-device sync ``` ```mobile support ``` ```multi-language Bibles ``` ```social features```.

### 1.3 Definitions, Acronyms, and Abbreviations
- **Verse**: A single unit of Bible text from the JSON dataset.
- **Reading Unit**: A contiguous group of verses in one notification.
- **Plan**: User-defined sequential reading schedule.
- **JSON Dataset**: Static file with book, chapter, verse, text.
- **Metadata JSON**: File with book names, counts, tags.
- **API**: Application Programming Interface.
- **UI**: User Interface.
- **SRS**: Software Requirements Specification.

### 1.4 References
- IEEE Std 830-1998: Recommended Practice for Software Requirements Specifications.
- Bible JSON Dataset (Amharic).
- Title-Based Metadata JSON.
- Chrome Extensions API Documentation.
- FastAPI Documentation.

### 1.5 Overview
Section 2 provides a high-level description. Section 3 details interfaces. Section 4 specifies features with prioritized requirements (MUST, SHOULD, MAY). Sections 5-6 cover non-functional and other requirements. Appendices include use cases, models, edges, and traceability.

## 2. Overall Description

### 2.1 Product Perspective
This system addresses deficiencies in existing Bible tools by providing interruption-resilient, notification-driven delivery from static data, ensuring completion without spam or loss.

### 2.2 Product Functions
- Deliver verses via notifications only.
- Support random and sequential modes.
- Adapt to interruptions (e.g., browser closure).
- Track progress and gather feedback.
- Manage data via backend API.

### 2.3 User Classes and Characteristics
- **End Users**: Adults seeking inspirational or structured Bible reading; basic tech literacy assumed.
- No admin users; self-service.

### 2.4 Operating Environment
- Browsers: MUST Chromium (Chrome, Edge); SHOULD Firefox, Brave.
- Backend: Python/FastAPI on standard servers.
- Network: Internet for sync; offline fallback.

### 2.5 Design and Implementation Constraints
- Extension: JavaScript, Manifest V3.
- Backend: RESTful, read-only.
- Standards: HTTPS, JSON.
- Permissions: Notifications, storage, alarms.

### 2.6 Assumptions and Dependencies
- JSON data is accurate and static.
- Users grant browser permissions.
- No external content sources.

## 3. External Interface Requirements

### 3.1 User Interfaces
- **Extension Popup**: React UI for plan setup, settings, progress.
- **Notifications**: Browser-native with verse text and buttons.

### 3.2 Hardware Interfaces
N/A (software-only).

### 3.3 Software Interfaces
- **Backend API** (RESTful):

| Endpoint | Method | Description | Parameters | Response |
|----------|--------|-------------|------------|----------|
| /books | GET | List books | None | JSON array |
| /metadata/{book} | GET | Counts/tags | Book name | JSON object |
| /verses/{book}/{chapter}/{start}/{end} | GET | Fetch verses | Path params | JSON verses |
| /plan/create | POST | Create plan | JSON body (books, boundaries, date) | Plan ID |
| /plan/{id} | GET | Get state | Plan ID | JSON units/states |
| /plan/{id}/update | PUT | Modify plan | JSON body | Updated plan |
| /unit/{id}/read | PUT | Mark read | Unit ID | Success |

- **Local Storage**: Key-value for caching (e.g., chrome.storage.sync).

### 3.4 Communications Interfaces
- HTTPS for API calls.
- Browser alarms for scheduling.

## 4. System Features

Requirements prefixed with FR (Functional Requirement), priority: MUST (mandatory), SHOULD (recommended), MAY (optional).

### 4.1 Random Verse Mode
FR-4.1.1: MUST deliver one random verse per notification, filtered by themes/time.  
FR-4.1.2: SHOULD adapt tone by time of day.  
FR-4.1.3: No progress tracking required.

### 4.2 Sequential Plan Mode
FR-4.2.1: MUST allow selection of books/chapters/verses/target date.  
FR-4.2.2: MUST deliver units sequentially.  
FR-4.2.3: SHOULD support pause/extend/modify.

### 4.3 Notification Delivery and Interaction
FR-4.3.1: MUST limit to one active notification.  
FR-4.3.2: MUST include actions: Read, Snooze, Dismiss, Copy, Read More, Add Note.  
FR-4.3.3: Pending units MUST wait silently.

### 4.4 Adaptive Scheduling
FR-4.4.1: MUST recalculate remaining verses/time.  
FR-4.4.2: MUST compensate by increasing verses per unit.  
FR-4.4.3: SHOULD offer plan extension if limits exceeded.

### 4.5 Progress Tracking and Feedback
FR-4.5.1: MUST display completed verses/stats.  
FR-4.5.2: SHOULD allow goal adjustments.  
FR-4.5.3: MAY include feedback ratings/suggestions.

### 4.6 Data Management
FR-4.6.1: MUST use hybrid backend/local storage for states.  
FR-4.6.2: MUST ensure zero verse loss per device.

## 5. Other Non-Functional Requirements

### 5.1 Performance Requirements
- API latency: < 200ms (95th percentile).
- Notification render: < 1s.
- Offline tolerance: Up to 24 hours.

### 5.2 Safety Requirements
- Data integrity: No verse skipping/duplication.
- User respect: No spam; quiet hours enforced.

### 5.3 Security Requirements
- Authentication: Optional session-based.
- Data: Read-only Bible access; no PII.

### 5.4 Software Quality Attributes
- Reliability: 99.9% uptime for backend.
- Maintainability: Modular code; 80% test coverage.
- Usability: Intuitive UI; accessibility (ARIA).

### 5.5 Business Rules
- Verse delivery: Exactly once.
- Compensation: Verse count only.

## 6. Other Requirements

### 6.1 Installation and Deployment
- Extension: Publish to Chrome Web Store.
- Backend: Dockerized deployment.

### 6.2 Privacy and Safety Constraints
- No scanning/tracking.
- Minimal state detection.

## Appendix A: Use Cases

| ID | Name | Actors | Preconditions | Steps | Postconditions | Exceptions |
|----|------|--------|---------------|-------|----------------|------------|
| UC-1 | Create Plan | User | UI open | 1. Select options. 2. Validate. 3. API call. | Plan stored | Invalid input: Alert. |
| UC-2 | Handle Notification | User/System | Unit pending | 1. Detect window. 2. Render. 3. Handle action. | State updated | Offline: Cache. |

(Additional use cases abbreviated; expand as needed.)

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