# Campus Notification Platform

A web app that shows campus notifications like Placements, Events, and Results.

## What's inside

- `logging_middleware` - logging package used by backend and frontend
- `notification_app_be` - backend server built with Express and TypeScript
- `notification_app_fe` - frontend built with Next.js and Material UI
- `priority_inbox.ts` - script that shows top 10 priority notifications
- `notification_system_design.md` - system design answers for all stages

## How to run the backend

Go into the backend folder and install packages:

```
cd notification_app_be
npm install
```

Create a file called `.env` inside `notification_app_be` and add this:

```
PORT=5000
AUTH_TOKEN=your_token_here
```

Then start the server:

```
npm run dev
```

Backend runs at `http://localhost:5000`

## How to run the frontend

Open a new terminal, go into the frontend folder and install packages:

```
cd notification_app_fe
npm install
```

Create a file called `.env.local` inside `notification_app_fe` and add this:

```
NEXT_PUBLIC_AUTH_TOKEN=your_token_here
```

Then start the frontend:

```
npm run dev
```

Frontend runs at `http://localhost:3000`

## Pages

- `http://localhost:3000` - shows all notifications, you can filter by type
- `http://localhost:3000/priority` - shows top notifications sorted by priority

## How priority works

Placement notifications are shown first, then Result, then Event. If two notifications have the same type, the newer one comes first.

## How to run the priority inbox script

```
cd <root folder>
npm install axios
set AUTH_TOKEN=your_token_here
npx ts-node priority_inbox.ts
```

This prints the top 10 priority notifications in the terminal.
