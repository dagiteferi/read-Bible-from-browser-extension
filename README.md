# Bible Reader Browser Extension

[![CI/CD Pipeline](https://github.com/dagiteferi/read-Bible-from-browser-extension/actions/workflows/ci-deploy.yml/badge.svg)](https://github.com/dagiteferi/read-Bible-from-browser-extension/actions/workflows/ci-deploy.yml)

A feature-rich, notification-driven browser extension for a personalized and immersive Bible reading experience, built with a modern tech stack.

This project provides a robust platform for users to engage with Scripture through a browser extension. It features a powerful FastAPI backend and a responsive React frontend, designed for reliability, scalability, and a seamless user experience. The system guarantees zero verse loss, respects user-defined quiet hours, and intelligently adapts to interruptions.

---

## Table of Contents

- [Key Features](#key-features)
- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Contact](#contact)
- [License](#license)

---

## Key Features

- **Notification-Driven Reading**: Receive Bible verses directly as browser notifications.
- **Customizable Reading Plans**: Create sequential reading plans by selecting books, chapters, and a target completion date.
- **Random Verse Mode**: Get inspirational verses on-demand, filtered by theme.
- **Intelligent & Resilient Delivery**: The system is designed to handle real-world interruptions like browser closures or PC sleep, ensuring no verses are ever lost.
- **Adaptive Pacing**: Automatically adjusts the number of verses per notification to stay on track with your goals without causing notification spam.
- **Progress Tracking**: Visualize your reading progress and statistics.
- **User-Defined Schedules**: Configure quiet hours and notification frequency to fit your lifestyle.
- **Offline First**: The extension is designed to work offline, syncing progress once a connection is restored.
- **Privacy-Focused**: No personal identifiable information (PII) is collected. The system uses a simple, anonymous device ID to sync plans.

## Architecture Overview

The system is composed of two main components: a backend API and a browser extension frontend.

```mermaid
graph TB
    subgraph "User's Browser"
        Extension[Browser Extension<br>(React, TypeScript, Manifest V3)]
        ServiceWorker[Service Worker<br>(background.ts for alarms, notifications)]
        PopupUI[Popup UI<br>(Plan creation, progress, settings)]
        LocalStorage[chrome.storage<br>(Offline cache for plans & progress)]
    end

    subgraph "Cloud Infrastructure (e.g., Render)"
        Backend[FastAPI Backend<br>(Python, Uvicorn/Gunicorn)]
        Database[(PostgreSQL Database<br>(Stores plans, progress, device IDs))]
        BibleData[In-Memory Bible Cache<br>(Loaded from static JSON files)]
    end

    Extension <-->|HTTPS API Calls| Backend
    ServiceWorker <-->|Fetch next verse| Backend
    Backend <-->|SQLAlchemy (async)| Database
    Backend -->|Loads at startup| BibleData
```

- **Backend**: A monolithic FastAPI service built with Python. It manages all business logic, including creating reading plans, segmenting scripture, and serving verses. It connects to a PostgreSQL database to persist user and plan data. For performance, the entire Bible text is loaded into an in-memory cache at startup from static JSON files.
- **Frontend**: A modern browser extension built with React, TypeScript, and Vite. It follows the Manifest V3 specification. A background service worker handles alarms and triggers notifications, while the popup UI allows users to manage their reading plans and settings.

For a more in-depth explanation of the architecture, see the [Solution Architecture Document](./docs/Architecture.md).

## Technology Stack

| Component | Technologies |
| :--- | :--- |
| **Backend** | Python, FastAPI, SQLAlchemy (async), Alembic, PostgreSQL, Gunicorn, Uvicorn, Pydantic |
| **Frontend** | TypeScript, React, Vite, Tailwind CSS, Chrome Extension Manifest V3 |
| **Database** | PostgreSQL |
| **DevOps** | Docker, Docker Compose, GitHub Actions for CI/CD |
| **Testing** | Pytest, Flake8, Black, MyPy |

## Getting Started

Follow these instructions to set up the project for local development.

### Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/en/) (v20 or later) and npm
- [Python](https://www.python.org/downloads/) (v3.12 or later)

### Backend Setup

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/dagiteferi/read-Bible-from-browser-extension.git
    cd read-Bible-from-browser-extension
    ```

2.  **Configure Environment:**
    The backend and data scraping scripts rely on environment variables. While Docker Compose sets the database variables, you may need a local `.env` file for running scripts directly.
    ```bash
    # Create a .env file from the example
    cp .env.example .env
    ```
    *Note: The default `docker-compose.yml` configuration is sufficient for local development.*

3.  **Launch Services:**
    Use Docker Compose to build and run the PostgreSQL database container.
    ```bash
    docker-compose up -d postgres
    ```

4.  **Prepare the Database:**
    This script runs the Alembic database migrations to create the necessary tables.
    ```bash
    ./scripts/init_db.sh
    ```
    *Note: The backend service itself is intended to be run directly on the host for easier development, but a Dockerfile is provided for production deployment.*

5.  **Install Dependencies and Run:**
    ```bash
    # Navigate to the backend directory
    cd backend

    # It's recommended to use a virtual environment
    python -m venv .venv
    source .venv/bin/activate

    # Install dependencies
    pip install -r requirements.txt

    # Run the FastAPI server
    uvicorn app.main:app --reload
    ```
    The API will be available at `http://127.0.0.1:8000`. You can view the interactive documentation at `http://127.0.0.1:8000/openapi.json`.

### Frontend Setup

1.  **Navigate to Extension Directory:**
    ```bash
    # From the project root
    cd extension
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Build the Extension:**
    This command compiles the React/TypeScript source code into the `extension/dist` directory. For development, you can run it in watch mode.
    ```bash
    # For a single build
    npm run build

    # For development with auto-rebuild on changes
    npm run build -- --watch
    ```

4.  **Load the Extension in Your Browser:**
    - Open Google Chrome and navigate to `chrome://extensions`.
    - Enable "Developer mode" in the top-right corner.
    - Click "Load unpacked".
    - Select the `read-Bible-from-browser-extension/extension/dist` directory.

The extension icon should now appear in your browser's toolbar.

## Project Structure

The repository is organized into several key directories:

```
.
├── .github/          # CI/CD workflows for GitHub Actions
├── backend/          # FastAPI backend source code
├── data/             # Scraped Bible data output
├── docs/             # Detailed project documentation (SRS, SAD)
├── extension/        # React/TypeScript browser extension source code
├── scripts/          # Helper scripts for database setup and migrations
├── docker-compose.yml # Defines services for local development (PostgreSQL)
└── README.md         # This file
```

## API Documentation

The backend API is self-documenting using OpenAPI. Once the backend server is running, you can access the interactive Swagger UI at `http://127.0.0.1:8000/docs`.

A high-level overview of the available endpoints is also available in the [Backend Documentation](./backend/BACKEND_DOCS.md).

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  **Fork** the repository.
2.  Create a new **branch** for your feature or bug fix (`git checkout -b feature/my-new-feature`).
3.  Make your changes and **commit** them with a clear message.
4.  **Push** your branch to your fork (`git push origin feature/my-new-feature`).
5.  Create a **Pull Request** to the `main` branch of the original repository.

Please ensure your code adheres to the project's coding standards and that all tests pass.

## Contact

- **Author**: Dagmawi Teferi
- **Email**: [dagiteferi2011@gmail.com](mailto:dagiteferi2011@gmail.com)
- **Telegram**: [@Pro_dagiiiEal](https://t.me/Pro_dagiiiEal)
- **GitHub**: [dagiteferi](https://github.com/dagiteferi)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
