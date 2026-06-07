import axios from "axios";
import { Log } from "../../../logging_middleware/index";
import { AUTH_TOKEN } from "../config/env";

const EXTERNAL_API = "http://4.224.186.213/evaluation-service/notifications";

const readSet = new Set<string>();

export async function getNotifications(limit: number, page: number, type?: string) {
  await Log("backend", "info", "service", `Fetching notifications limit=${limit} page=${page} type=${type || "all"}`);
  const params: Record<string, string | number> = { limit, page };
  if (type) params.notification_type = type;

  const response = await axios.get(EXTERNAL_API, {
    headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    params,
  });

  const notifications = (response.data.notifications || []).map((n: any) => ({
    ...n,
    isRead: readSet.has(n.ID),
  }));

  return { notifications, total: notifications.length, page, limit };
}

export async function markAsRead(id: string) {
  await Log("backend", "info", "service", `Marking notification ${id} as read`);
  readSet.add(id);
  return { id, isRead: true };
}

export async function getUnreadCount() {
  await Log("backend", "info", "service", "Fetching unread count");
  return readSet.size;
}
