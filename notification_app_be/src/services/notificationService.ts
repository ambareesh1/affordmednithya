import Notification from "../db/notificationModel";
import { Log } from "../../../logging_middleware/index";

export async function getNotifications(limit: number, page: number, type?: string) {
  await Log("backend", "info", "service", `Fetching notifications limit=${limit} page=${page} type=${type || "all"}`);
  const query: Record<string, unknown> = {};
  if (type) {
    query.type = type;
  }
  const skip = (page - 1) * limit;
  const notifications = await Notification.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
  const total = await Notification.countDocuments(query);
  return { notifications, total, page, limit };
}

export async function markAsRead(id: string) {
  await Log("backend", "info", "service", `Marking notification ${id} as read`);
  const notification = await Notification.findOneAndUpdate({ id }, { isRead: true }, { new: true });
  return notification;
}

export async function getUnreadCount() {
  await Log("backend", "info", "service", "Fetching unread notification count");
  const count = await Notification.countDocuments({ isRead: false });
  return count;
}
