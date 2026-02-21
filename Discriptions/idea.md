Notification-Driven Bible Reading Browser Extension
=====================================================

Formal System Description, Data Model, Design Intent, and Feature Specification
--------------------------------------------------------------------------------

### 1. System Overview

This browser extension is a fully notification-driven Bible reading system designed to deliver Scripture reliably, respectfully, and without loss under real-world conditions such as browser closure, PC sleep, user absence, presentations, or quiet hours. The system guarantees that every intended verse is delivered exactly once, without duplication, skipping, or notification spam, while dynamically adapting to interruptions and user availability. Scripture delivery occurs exclusively through browser notifications, and all content is sourced from a pre-existing structured Bible JSON dataset, exposed through a backend API.

### 2. Problem Definition

Most Bible reading and notification tools fail to operate reliably in real working environments. Common problems include:

*   Scripture notifications being lost when the browser or PC is closed
*   Reading plans skipping verses or repeating content after interruptions
*   Catch-up notification spam after periods of absence
*   Lack of guarantee that a book or plan will actually be completed
*   Manual opening required instead of passive delivery
*   No clear separation between content storage and delivery logic

The core problem is the absence of a notification-first, data-driven, interruption-resilient system that can deliver Scripture from a static Bible dataset while guaranteeing completion, consistency, and user respect.

### 3. Core Design Goals

The system is designed around the following fixed goals:

1.  **Zero Verse Loss**: Every verse selected from the Bible dataset must be delivered exactly once.
2.  **Notification-Only Delivery**: Scripture is delivered solely via browser notifications.
3.  **Data-Driven Scripture Source**: All verses originate from an existing JSON Bible dataset.
4.  **No Notification Spam**: Missed time is compensated by increasing verse volume per notification, not notification count.
5.  **Explicit User Confirmation**: Sequential reading progress advances only on user confirmation.
6.  **Real-World Interruption Awareness**: The system must adapt to closures, sleep, presentations, and absence automatically.

### 4. Bible Data Source and Content Model

#### 4.1 Bible JSON Dataset

The system uses a pre-existing Bible dataset stored as JSON, structured by:

*   Book title
*   Chapter number
*   Verse number
*   Verse text (Amharic Bible)

This dataset is considered static, authoritative, and complete. No external Bible APIs are used for verse content.

#### #### 4.2 Title-Based JSON Index

In addition to the main Bible text JSON, the system uses title-based JSON metadata, which includes:

*   Book names
*   Chapter counts
*   Verse counts per chapter
*   Optional thematic or categorical tags

This metadata is used to:
- Validate user-selected ranges
- Precompute reading plans
- Enable fast lookup without scanning full text repeatedly

#### 4.3 Backend API Role

A backend service (e.g., FastAPI) exposes the Bible data through read-only endpoints that:
- Fetch verses by book / chapter / verse range
- Return verse counts for plan calculations
- Provide metadata for UI selection
- Support deterministic segmentation of verses into reading units
The backend does not modify Scripture content; it only reads from the JSON data and applies logic on top of it.

#### 5. System Operating Modes

##### 5.1 Random Verse Mode
- Delivers a single verse per notification
- Verse is randomly selected from the JSON dataset
- Selection is filtered by user-chosen themes (derived from title-based metadata)
- Content tone adapts by time of day
- No progress tracking
- No mandatory read confirmation
- Intended for light inspiration during work or breaks

##### 5.2 Sequential Plan Mode
- User selects:
    - Book(s) (e.g., Luke)
    - Optional chapter or verse boundaries
    - Target completion date or duration

- The system delivers verses sequentially according to the selected plan, ensuring that users can complete their reading goals in a structured manner.

##### 5.3 Notification Settings
- Users can customize notification settings:
    - Choose notification sounds
    - Set quiet hours to avoid interruptions
    - Select notification frequency (e.g., daily, weekly)

##### 5.4 Progress Tracking
- The system tracks reading progress:
    - Users can view completed verses
    - Provides statistics on reading habits
    - Allows users to set and adjust reading goals

##### 5.5 User Feedback Mechanism
- Users can provide feedback on notifications:
    - Rate the relevance of verses
    - Suggest improvements for the notification system
    - Report issues with content delivery

### 6. Reading Unit Model
Each reading unit represents a contiguous range of verses sourced directly from the Bible JSON.
Each unit includes:
    • Book name
    • Chapter and verse range
    • Verse text payload
    • Unit index in plan sequence
    • State (pending, delivered, read)
Units are:
    • Stored persistently in the backend
    • Mirrored in extension local storage
    • Never skipped, reordered, or deleted until confirmed read

### 7. Notification Delivery and Interaction

#### 7.1 Notification Rules
- One active notification at a time
- No overlapping notifications
- No replay of missed notifications
- Pending units wait silently during pauses

#### 7.2 Notification Actions
Each notification includes:
1. **Read / Mark as Read**  
   - Advances the plan
2. **Snooze**  
   - Postpones the notification for a user-defined duration
3. **Dismiss**  
   - Removes the notification without marking it as read



### 9. Adaptive Scheduling and Completion Guarantees
- Backend continuously recalculates:
    - Remaining verses (from JSON counts)
    - Remaining time
    - Allowed delivery windows
- Compensation occurs by:
    - Increasing verse range per unit
    - Never increasing notification frequency
- User limits (max verses per notification) are respected
- Optional plan extension offered if limits are exceeded



### ### 11. Architecture Responsibilities

#### Backend Responsibilities
- Read-only access to Bible JSON data
- Plan math and segmentation
- Adaptive pacing logic
- Persistent plan state
- API exposure

#### Extension Responsibilities
- Environment detection
- Notification rendering
- Local queue safety
    • User interaction handling
    • UI for settings, notes, and progress

### 12. Privacy and Safety Constraints
- No page content scanning
- No keystroke tracking
- No behavioral profiling
- Only minimal browser state detection
- Bible data remains local or backend-controlled

### 13. Future Feature Roadmap
Future extensions may include:
1. Audio verse delivery
2. Multi-language Bible JSON support
3. Cross-device sync
4. Advanced reading analytics
5. AI summaries (derived, not replacing Scripture)
6. Exportable notes and reading history

All future features must preserve:
- User privacy and data security
- The integrity of the Scripture content
- A user-friendly experience

### 14. Final Summary
This system is a data-driven, notification-first Bible reading platform built on a structured JSON Bible dataset and title-based metadata. By combining deterministic verse segmentation, persistent reading units, adaptive pacing, and strict notification control, the system guarantees that every verse from the provided Bible data reaches the user exactly once—without pressure, spam, or loss—while fitting naturally into real work and life environments.


### 15. Architect Assumptions and Design Decisions

1. **Verse Loss Scope**  
   - Zero verse loss is guaranteed **per device only**.  
   - No cross-device synchronization is required in the initial version.

2. **PC / Browser Closed Behavior**  
   - If the browser or PC is closed during **user-defined working hours**, notifications are **queued** and delivered when the browser is reopened.  
   - Missed notifications are **not lost**; the system compensates by adjusting verse count per notification.  
   - Outside working hours, notifications are not delivered.

3. **Read Status Source of Truth**  
   - Hybrid approach:  
     - **Backend** stores the reading plan, verse sequences, and read state.  
     - **Local storage** caches read/unread states to handle temporary offline periods.  
   - Synchronization occurs automatically when the browser reconnects.

4. **Maximum Verses per Notification**  
   - Dynamically calculated based on:  
     - User’s reading goal  
     - Total verses in the plan  
     - Notification interval  
   - Ensures plan completion without overwhelming the user.

5. **Plan Mutability**  
   - Users can **pause, extend, or modify reading plans** at any time.  
   - Changes dynamically recalculate remaining verses and notification schedule.

6. **Notification Scope**  
   - Notifications are **browser-only**; no mobile or OS-level notifications.  
   - Interactive actions: Read/Mark as Read, Snooze, Dismiss, Copy to Clipboard, Read More, Add Note.

7. **Browser Support**  
   - Primary: **Chromium-based browsers** (Chrome, Edge).  
   - Goal: **Maximize compatibility** with other browsers (Firefox, Brave) where feasible.

8. **Data Model**  
   - Bible content is sourced from **pre-existing JSON dataset** (Amharic).  
   - Title-based JSON metadata is used for:  
     - Verse counts  
     - Precomputing plans  
     - Thematic filtering for random verses  
   - Backend exposes **read-only API endpoints**.

9. **Adaptive Scheduling**  
   - The system adapts delivery based on:  
     - Working hours  
     - User absence  
     - Fullscreen/presentation mode  
     - Paused plans  

10. **Limitations for Initial Version**  
    - No cross-device sync  
    - No mobile app notifications  
    - No social/collaboration features beyond copy/export of notes

I