# Event Manager Backend

Spring Boot backend for the UniEvents API.

## What is implemented

- Read endpoints for events and categories
- Write endpoints for create, update, and delete
- JPA persistence layer with PostgreSQL runtime configuration
- Automatic seeding of starter events on first run
- Integration tests that run against in-memory H2

## Runtime database (PostgreSQL)

Main runtime uses PostgreSQL via environment variables:

- `DB_URL` (default: `jdbc:postgresql://localhost:5432/event_manager`)
- `DB_USERNAME` (default: `postgres`)
- `DB_PASSWORD` (default: `postgres`)

If you use local PostgreSQL, create the database first (example):

```sql
CREATE DATABASE event_manager;
```

## Quick start

```powershell
mvn test
$env:DB_URL="jdbc:postgresql://localhost:5432/event_manager"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="postgres"
mvn spring-boot:run
```

API base URL: `http://localhost:8080/api`

### Useful endpoints

- `GET /api/events`
- `GET /api/events/{id}`
- `POST /api/events`
- `PUT /api/events/{id}`
- `DELETE /api/events/{id}`
- `GET /api/events/categories`
- `GET /api/health`

### Create event payload example

```json
{
  "title": "Data Science Meetup",
  "description": "Open meetup for students interested in data science.",
  "date": "2026-04-21",
  "time": "18:30:00",
  "location": "Innovation Hub",
  "category": "Workshop",
  "featured": false
}
```

### Update event payload example

```json
{
  "title": "Updated Event Title",
  "description": "Updated description.",
  "date": "2026-04-25",
  "time": "17:00:00",
  "location": "Room 101",
  "category": "Guest Lecture",
  "featured": true
}
```
