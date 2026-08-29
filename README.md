# 🎓 UniEvents — University Event Management System

A full-stack web application for discovering, registering for, and managing university events. Built with **React + TypeScript** on the frontend and **Spring Boot + Java** on the backend, backed by a **PostgreSQL** database with Flyway-managed migrations.

**[🌐 Live Demo](https://event-manager.trj.app/)**

---

## ✨ Features

- **Event Discovery** — Browse upcoming university events with category-based visual cards
- **User Authentication** — Secure signup and login with BCrypt password hashing
- **Dark Mode** — Full light/dark theme support with system preference detection
- **Responsive Design** — Mobile-first layout that works across all screen sizes
- **RESTful API** — Clean REST endpoints with filtering, search, and validation
- **Database Migrations** — Version-controlled schema using Flyway

## 🏗️ Architecture

```
event-manager/
├── frontend/          # React + TypeScript (Vite)
│   ├── src/
│   │   ├── api/       # API client functions
│   │   ├── components/# Reusable UI components
│   │   ├── context/   # React Context (Auth state)
│   │   ├── pages/     # Page-level components
│   │   └── types/     # TypeScript type definitions
│   └── ...
└── backend/           # Spring Boot + Java
    └── src/main/java/com/unievents/backend/
        ├── auth/      # Authentication (controller, service, DTOs)
        ├── events/    # Event CRUD (controller, service, repository)
        ├── config/    # CORS, security configuration
        └── exception/ # Global error handling
```

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | Component-based UI library |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Fast build tooling and dev server |
| **Tailwind CSS** | Utility-first styling |
| **Context API** | Client-side auth state management |

### Backend
| Technology | Purpose |
|---|---|
| **Java 24** | Core language |
| **Spring Boot 3.5** | Application framework |
| **Spring Data JPA** | Database ORM |
| **Spring Security** | Authentication framework |
| **PostgreSQL** | Relational database |
| **Flyway** | Database migration management |
| **Lombok** | Boilerplate reduction |
| **Bean Validation** | Request DTO validation |

## 📊 Database Schema

The database includes 8 tables with full referential integrity:

```
users ─────────┬──── registrations ────── events
               │                           │
               ├──── feedback ─────────────┤
               │                           │
               └──── user_departments      ├──── event_categories ──── categories
                         │                 │
                     departments            └──── announcements
```

- **users** — Students, organizers, and admins with role-based access
- **events** — Event details (title, description, date, time, location, capacity)
- **registrations** — User-event registrations with status tracking
- **feedback** — Post-event ratings (1–5) and comments
- **announcements** — Event-specific announcements
- **departments** / **categories** — Organizational taxonomies with many-to-many mappings

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate and receive a token |

### Events
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/events` | List all events (supports filters) |
| `GET` | `/api/events/{id}` | Get a single event by ID |
| `POST` | `/api/events` | Create a new event |
| `PUT` | `/api/events/{id}` | Update an existing event |
| `DELETE` | `/api/events/{id}` | Delete an event |

**Query Parameters** for `GET /api/events`:
- `q` — Full-text search on title/description
- `category` — Filter by category
- `dateFrom` / `dateTo` — Filter by date range

## 🚀 Getting Started

### Prerequisites

- **Java 24** (or compatible JDK)
- **Node.js 18+** and **npm**
- **PostgreSQL 15+**

### 1. Clone the Repository

```bash
git clone https://github.com/tharinrj/university-event-management-system.git
cd university-event-management-system
```

### 2. Set Up the Database

Create a PostgreSQL database:

```sql
CREATE DATABASE event_manager;
```

### 3. Start the Backend

```bash
cd backend

# Set environment variables (or use defaults: postgres/postgres)
export DB_USERNAME=your_db_user
export DB_PASSWORD=your_db_password

# Build and run
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`. Flyway will automatically run migrations on first startup.

### 4. Start the Frontend

```bash
cd frontend

npm install
npm run dev
```

The frontend will start on `http://localhost:5173` and proxy API requests to the backend.

## 🗺️ Roadmap

- [ ] **JWT Authentication** — Replace placeholder tokens with proper JWT-based auth
- [ ] **Event Registration** — Register/cancel for events from the UI
- [ ] **Event Detail Page** — Dedicated page with full event info and registration
- [ ] **Search & Filter UI** — Category pills, date picker, and search bar
- [ ] **Event Creation UI** — Admin/organizer form for creating and editing events
- [ ] **Feedback System** — Post-event ratings and comments