# InfoMate Backend

Node.js + Express + PostgreSQL backend for InfoMate.

## Setup

### 1. Start PostgreSQL with Docker

```bash
docker compose up -d
```

This starts a PostgreSQL 16 container on port 5432.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_gemini_api_key
```

### 4. Run database migrations

```bash
npm run db:migrate
```

### 5. Start the server

```bash
npm run dev
```

Server runs on `http://localhost:5000`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Create account |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/subjects | Get user subjects |
| POST | /api/subjects | Add subject |
| GET | /api/timetable | Get timetable |
| POST | /api/timetable | Add timetable entry |
| GET | /api/attendance/summary | Attendance per subject |
| POST | /api/attendance | Mark attendance |
| POST | /api/ai/chat | Chat with AI tutor |
| GET | /api/ai/history/:subjectId | Get chat history |
| GET | /api/goals | Get today's goals |
| POST | /api/goals | Add goal |
| PATCH | /api/goals/:id | Toggle goal |
| GET | /api/activity | Recent activity |
| GET | /api/activity/notifications | Notifications |
