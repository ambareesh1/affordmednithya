# Campus Notification Platform

A full stack web application for real-time campus notifications — Placements, Events, and Results.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React 18, Material UI |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB (Mongoose) |
| Logging | Custom middleware → external log API |

---

## Project Structure

```
.
├── logging_middleware/        # Reusable logging package
├── notification_app_be/       # Express + TypeScript backend
├── notification_app_fe/       # Next.js + MUI frontend
├── priority_inbox.ts          # Stage 6 — standalone priority inbox code
└── notification_system_design.md  # System design (Stages 1–6)
```

---

## Prerequisites

- Node.js >= 18
- MongoDB running locally (or a MongoDB Atlas URI)
- Auth token from the evaluation server (see Registration below)

---

## Registration & Auth Token

1. POST to `http://4.224.186.213/evaluation-service/register` with your details to get `clientID` and `clientSecret`
2. POST to `http://4.224.186.213/evaluation-service/auth` with those credentials to get your `access_token`
3. Use that token as `AUTH_TOKEN` in the backend and `NEXT_PUBLIC_AUTH_TOKEN` in the frontend

---

## Running the Backend

```bash
cd notification_app_be
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campus_notifications
AUTH_TOKEN=your_access_token_here
```

Start the dev server:

```bash
npm run dev
```

The backend runs on `http://localhost:5000`.

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notifications` | List notifications (supports `limit`, `page`, `notification_type`) |
| GET | `/api/notifications/:id` | Get single notification |
| PATCH | `/api/notifications/:id/read` | Mark notification as read |
| GET | `/api/notifications/unread-count` | Get unread count |

---

## Running the Frontend

```bash
cd notification_app_fe
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_AUTH_TOKEN=your_access_token_here
```

Start the dev server:

```bash
npm run dev
```

The frontend runs on `http://localhost:3000`.

### Pages

| Route | Description |
|---|---|
| `/` | All notifications with type filter and pagination |
| `/priority` | Priority inbox — top N notifications ranked by type weight and recency |

---

## Running the Priority Inbox Script (Stage 6)

```bash
cd <root>
npm install axios
AUTH_TOKEN=your_access_token_here npx ts-node priority_inbox.ts
```

Outputs the top 10 priority notifications as JSON.

---

## Running the Logging Middleware

The logging middleware is used internally by both backend and frontend. To use it standalone:

```bash
cd logging_middleware
npm install
npm run build
```

Then import and call:

```ts
import { Log } from "./logging_middleware";
await Log("backend", "info", "service", "Something happened");
```

---

## Notification Types

| Type | Priority Weight |
|---|---|
| Placement | 3 (highest) |
| Result | 2 |
| Event | 1 (lowest) |

---

## How Read State Works

The frontend tracks which notifications have been viewed using `localStorage`. Clicking a notification card marks it as read. Unread notifications are highlighted with a blue border and a **NEW** badge.
