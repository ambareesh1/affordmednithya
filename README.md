# Campus Notification Platform

A full stack web application where students get real-time notifications about Placements, Events, and Results.

---

## Tech Stack

- **Frontend** - Next.js, React, Material UI
- **Backend** - Node.js, Express, TypeScript
- **Database** - MongoDB
- **Logging** - Custom logging middleware (no console.log)

---

## Folder Structure

```
affordmednithya/
├── logging_middleware/           # Shared logging package used by backend and frontend
├── notification_app_be/          # Express backend (runs on port 5000)
├── notification_app_fe/          # Next.js frontend (runs on port 3000)
├── priority_inbox.ts             # Stage 6 - priority inbox standalone script
└── notification_system_design.md # System design document (Stages 1 to 6)
```

---

## Step 1 - Get Your Auth Token

You need an auth token before running anything.

### Register (do this only once)

Send a POST request to:

```
http://4.224.186.213/evaluation-service/register
```

Request body:

```json
{
  "email": "your_college_email@example.com",
  "name": "Your Full Name",
  "mobileNo": "9999999999",
  "githubUsername": "your_github_username",
  "rollNo": "2023005195",
  "accessCode": "code_from_your_email"
}
```

Save the `clientID` and `clientSecret` from the response. You cannot get them again.

### Get Token

Send a POST request to:

```
http://4.224.186.213/evaluation-service/auth
```

Request body:

```json
{
  "email": "your_college_email@example.com",
  "name": "Your Full Name",
  "rollNo": "2023005195",
  "accessCode": "code_from_your_email",
  "clientID": "your_client_id",
  "clientSecret": "your_client_secret"
}
```

Copy the `access_token` from the response. This is your `AUTH_TOKEN`.

---

## Step 2 - Run the Backend

```bash
cd notification_app_be
npm install
```

Create a file called `.env` inside `notification_app_be`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campus_notifications
AUTH_TOKEN=paste_your_access_token_here
```

Start the server:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`

### Available API Endpoints

| Method | URL | What it does |
|--------|-----|--------------|
| GET | `/api/notifications` | Get all notifications |
| GET | `/api/notifications/:id` | Get one notification |
| PATCH | `/api/notifications/:id/read` | Mark as read |
| GET | `/api/notifications/unread-count` | Get unread count |

You can also filter with query params:

```
GET /api/notifications?limit=10&page=1&notification_type=Placement
```

---

## Step 3 - Run the Frontend

```bash
cd notification_app_fe
npm install
```

Create a file called `.env.local` inside `notification_app_fe`:

```
NEXT_PUBLIC_AUTH_TOKEN=paste_your_access_token_here
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`

### Pages

| Page | URL | Description |
|------|-----|-------------|
| All Notifications | `http://localhost:3000` | Shows all notifications with type filter |
| Priority Inbox | `http://localhost:3000/priority` | Shows top N notifications ranked by priority |

---

## Step 4 - Run the Priority Inbox Script (Stage 6)

This is a standalone script that fetches notifications and shows the top 10 by priority.

From the root folder:

```bash
# Windows
set AUTH_TOKEN=your_access_token_here && npx ts-node priority_inbox.ts

# Mac / Linux
AUTH_TOKEN=your_access_token_here npx ts-node priority_inbox.ts
```

---

## How Notifications are Prioritized

| Type | Weight |
|------|--------|
| Placement | 3 (highest) |
| Result | 2 |
| Event | 1 (lowest) |

Notifications with higher weight show first. If two notifications have the same type, the newer one shows first.

---

## How Read / Unread Works

The frontend stores which notifications you have seen in `localStorage`. When you open a notification it gets marked as read. Unread notifications show a blue border and a **NEW** badge.

---

## Common Errors and Fixes

**Error: Cannot find module 'axios' in logging_middleware**

This means you have an old version of the code. Pull the latest from GitHub:

```bash
git pull origin main
```

Then re-run `npm install` inside `notification_app_be` and `notification_app_fe`.

**Error: MongoDB connection failed**

Make sure MongoDB is running on your machine:

- Windows: Search for "MongoDB" in Services and start it
- Or use MongoDB Atlas and paste the connection string in `MONGODB_URI`

**Error: 401 Unauthorized from log API**

Your `AUTH_TOKEN` is wrong or expired. Re-do Step 1 to get a new token.
