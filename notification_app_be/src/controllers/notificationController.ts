import { Request, Response } from "express";
import { getNotifications, markAsRead, getUnreadCount } from "../services/notificationService";
import { Log } from "../../../logging_middleware/index";

export async function getAllNotifications(req: Request, res: Response): Promise<void> {
  await Log("backend", "info", "controller", "getAllNotifications called");
  const limit = parseInt(req.query.limit as string) || 10;
  const page = parseInt(req.query.page as string) || 1;
  const type = req.query.type as string | undefined;
  const result = await getNotifications(limit, page, type);
  res.json(result);
}

export async function markNotificationAsRead(req: Request, res: Response): Promise<void> {
  await Log("backend", "info", "controller", `markNotificationAsRead called for id=${req.params.id}`);
  const notification = await markAsRead(req.params.id);
  if (!notification) {
    res.status(404).json({ message: "Notification not found" });
    return;
  }
  res.json(notification);
}

export async function getUnreadNotificationCount(req: Request, res: Response): Promise<void> {
  await Log("backend", "info", "controller", "getUnreadNotificationCount called");
  const count = await getUnreadCount();
  res.json({ count });
}
