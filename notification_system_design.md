# Campus Notification Platform — System Design

---

# Stage 1

## REST API Design

### GET /api/notifications

Fetch a paginated list of notifications.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Number of notifications per page (default: 10) |
| page | number | Page number (default: 1) |
| type | string | Filter by type: Event, Result, Placement |

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response:**
```json
{
  "notifications": [
    {
      "id": "notif_001",
      "type": "Placement",
      "message": "TCS campus drive scheduled for Dec 20",
      "timestamp": "2024-12-10T10:00:00Z",
      "isRead": false,
      "createdAt": "2024-12-10T09:55:00Z"
    }
  ],
  "total": 120,
  "page": 1,
  "limit": 10
}
```

---

### GET /api/notifications/:id

Fetch a single notification by ID.

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "notif_001",
  "type": "Placement",
  "message": "TCS campus drive scheduled for Dec 20",
  "timestamp": "2024-12-10T10:00:00Z",
  "isRead": false,
  "createdAt": "2024-12-10T09:55:00Z"
}
```

**Error Response (404):**
```json
{
  "message": "Notification not found"
}
```

---

### PATCH /api/notifications/:id/read

Mark a notification as read.

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response:**
```json
{
  "id": "notif_001",
  "type": "Placement",
  "message": "TCS campus drive scheduled for Dec 20",
  "timestamp": "2024-12-10T10:00:00Z",
  "isRead": true,
  "createdAt": "2024-12-10T09:55:00Z"
}
```

---

### GET /api/notifications/unread-count

Get the count of unread notifications.

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "count": 15
}
```

---

### Real-time Notifications (SSE)

**GET /api/notifications/stream**

Server-Sent Events endpoint for real-time push notifications.

**Request Headers:**
```
Authorization: Bearer <token>
Accept: text/event-stream
```

**Response (stream):**
```
data: {"id":"notif_002","type":"Result","message":"Semester results published","timestamp":"2024-12-10T11:00:00Z","isRead":false}

data: {"id":"notif_003","type":"Event","message":"Annual tech fest registration open","timestamp":"2024-12-10T11:05:00Z","isRead":false}
```

The client connects once and receives events as they are pushed. On reconnect, the `Last-Event-ID` header can be used to resume from a specific notification.

---

# Stage 2

## Database Choice: MongoDB

MongoDB is chosen as the database because it stores data as flexible JSON-like documents, which suits notifications that may have varying fields depending on the type. It scales horizontally via sharding and provides built-in TTL indexes for automatic expiry of old documents.

## Schema Definition

**Collection: notifications**

```json
{
  "_id": "ObjectId",
  "id": "string (unique notification ID)",
  "studentId": "string (roll number)",
  "type": "string (Event | Result | Placement)",
  "message": "string",
  "timestamp": "string (ISO 8601)",
  "isRead": "boolean (default: false)",
  "createdAt": "Date"
}
```

## Problems as Volume Increases

1. **Query slowness**: Fetching unread notifications for a student with no index requires a full collection scan. At millions of documents this becomes very slow.
2. **Storage growth**: Notifications accumulate indefinitely. Old notifications consume disk space and slow down queries.
3. **Index bloat**: Too many indexes slow down write operations (insert, update) because each index must be updated on every write.

## Solutions

1. **Compound index on studentId + isRead + createdAt:**
```js
db.notifications.createIndex({ studentId: 1, isRead: 1, createdAt: -1 })
```
This allows MongoDB to jump directly to a student's unread notifications sorted by date.

2. **Sharding by studentId:**
Distribute data across multiple MongoDB nodes using `studentId` as the shard key. Each shard handles a subset of students.
```js
sh.shardCollection("campus_db.notifications", { studentId: 1 })
```

3. **TTL index for automatic cleanup:**
```js
db.notifications.createIndex({ createdAt: 1 }, { expireAfterSeconds: 7776000 })
```
This automatically deletes notifications older than 90 days.

## Sample MongoDB Queries

**GET /api/notifications (paginated, filtered by type):**
```js
db.notifications.find(
  { studentId: "2023005195", type: "Placement" },
  { limit: 10, skip: 0, sort: { createdAt: -1 } }
)
```

**GET /api/notifications/:id:**
```js
db.notifications.findOne({ id: "notif_001", studentId: "2023005195" })
```

**PATCH /api/notifications/:id/read:**
```js
db.notifications.findOneAndUpdate(
  { id: "notif_001", studentId: "2023005195" },
  { $set: { isRead: true } },
  { returnDocument: "after" }
)
```

**GET /api/notifications/unread-count:**
```js
db.notifications.countDocuments({ studentId: "2023005195", isRead: false })
```

---

# Stage 3

## SQL Query Analysis

**Is the given SQL query accurate?**

Yes, the query is logically correct — it retrieves unread notifications for a student ordered by creation date. However, it is slow on large datasets.

**Why is it slow:**

Without an index, the database performs a full table scan across all 5 million rows. For each row it checks `studentId`, `isRead`, and then sorts the result. The time complexity is O(n) where n is the total number of rows.

**What to change:**

Create a compound index covering the three columns used in the WHERE clause and ORDER BY:

```sql
CREATE INDEX idx_unread ON notifications(studentId, isRead, createdAt ASC);
```

With this index, the query runs in O(log n) time because the database can jump directly to the matching rows using the B-tree structure.

**Why adding indexes on every column is bad advice:**

Over-indexing slows down INSERT, UPDATE, and DELETE operations because every write must update all indexes. It also wastes storage. Only index columns that appear in WHERE, JOIN, or ORDER BY clauses of frequent queries.

**Query for Placement notifications in the last 7 days:**

```sql
SELECT * FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL 7 DAY;
```

---

# Stage 4

## Problem: Database Overwhelmed on Page Load

When every student loads the notification page, the server fetches from the database on every request. With thousands of concurrent students, the database receives thousands of simultaneous queries, causing high CPU, memory pressure, and slow response times.

## Solutions

### 1. Redis Caching with TTL

Cache the notification list per student in Redis with a short TTL (e.g., 60 seconds). On each request, check Redis first. If a cache hit, return the cached data. If a miss, query the database and store the result in Redis.

**Tradeoff:** Stale data. A student may see notifications that are up to 60 seconds old. New notifications are not visible immediately.

### 2. Pagination

Only fetch a small number of notifications at a time (e.g., 10 per page) instead of loading all notifications at once.

**Tradeoff:** Does not reduce the number of database connections, only the size of each query. Not a real-time solution.

### 3. SSE or WebSocket for Push Instead of Poll

Instead of the client polling the API every few seconds, the server pushes new notifications to connected clients via SSE or WebSocket.

**Tradeoff:** Maintaining open connections for thousands of students requires more server resources. Horizontal scaling of SSE/WebSocket servers is more complex.

### 4. CDN for Static Assets + Edge Caching

Serve static frontend assets (JS, CSS) from a CDN. Use edge caching for public API responses.

**Tradeoff:** Notification data is personalized per student and cannot be cached at the CDN level.

### Best Approach

Combine **Redis caching** (TTL: 30–60 seconds) with **SSE** for real-time delivery. Redis handles the load from repeated page loads. SSE pushes new notifications instantly without polling. When a new notification is created, the Redis cache is invalidated and the new notification is pushed via SSE.

---

# Stage 5

## Shortcomings of the Given Pseudocode

The given pseudocode processes 50,000 students in a sequential for-loop:

1. **Synchronous sequential processing**: Each student is processed one at a time. With 50,000 students, this takes an extremely long time.
2. **No fault tolerance**: If `send_email` fails for one student (e.g., student 200), the loop stops mid-way. The remaining 49,800 students never receive the notification.
3. **DB save and email send are coupled**: If the email fails, the database save for that student may also be skipped, leaving the system in an inconsistent state.

**What happens when send_email fails for 200 students midway:**

The loop exits with an exception at student 200. Students 1–199 received the email and were saved to the DB. Students 201–50,000 received neither the email nor the DB save. The notification is silently lost for 49,800 students.

**Should DB save and email send happen together?**

No. These are two separate concerns. The database save should always succeed (idempotent write), regardless of whether the email was sent. Email delivery is a best-effort operation and should be handled separately with retries.

## Redesigned Approach: Message Queue

Use a message queue (BullMQ / RabbitMQ / Redis Queue) to decouple notification creation from delivery.

**Flow:**
1. Push all 50,000 student IDs and the message into a queue in batches of 100.
2. Worker processes pick up each batch concurrently.
3. DB save is done in bulk for the batch first (guaranteed, idempotent).
4. Email sending is attempted for each student individually. Failures go to a dead letter queue for retry.
5. Push notification to app is sent separately.

**Revised Pseudocode:**

```
function notify_all(student_ids, message):
    for batch in chunks(student_ids, 100):
        queue.push({ batch, message, type: "notify" })

worker function process_batch(batch, message):
    save_to_db_bulk(batch, message)
    for student_id in batch:
        try:
            send_email(student_id, message)
        except:
            dead_letter_queue.push(student_id)
        push_to_app(student_id, message)
```

This ensures DB saves always succeed, failed emails are retried automatically, and the system can process all 50,000 students concurrently in batches.

---

# Stage 6

## Priority Inbox Algorithm

**Priority formula:**

```
priority = weight * 1_000_000_000_000 + unix_timestamp_ms
```

**Weights:**
- Placement = 3 (highest priority)
- Result = 2
- Event = 1 (lowest priority)

The large multiplier ensures that type weight always dominates recency. Within the same type, newer notifications rank higher.

## Max-Heap Approach

A max-heap is used to efficiently maintain the top N notifications.

**On initial load:**
Push all notifications into the max-heap and extract the top N in O(N log M) time, where M is the total number of notifications.

**When a new notification arrives:**
- If the heap has fewer than N items, push the new notification.
- If the heap already has N items, compare the new notification's priority with the minimum priority in the heap. If the new notification has higher priority, pop the minimum and push the new notification.

This keeps the heap size bounded at N and each insertion takes O(log N) time.

**Implementation:** See `priority_inbox.ts` in the root of this repository.
