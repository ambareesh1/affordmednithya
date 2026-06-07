import { useState, useEffect, useCallback } from "react";
import { fetchNotifications, Notification, FetchParams } from "../api/notifications";
import { Log } from "../middleware/logger";

export function useNotifications(params: FetchParams = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const getReadIds = (): string[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("readNotifications");
    return stored ? JSON.parse(stored) : [];
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Log("debug", "hook", `Loading notifications page=${params.page}`);
      const data = await fetchNotifications(params);
      const readIds = getReadIds();
      const withRead = data.map((n) => ({ ...n, isRead: readIds.includes(n.ID) }));
      setNotifications(withRead);
      if (params.limit) {
        setTotalPages(Math.ceil(data.length / params.limit) || 1);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch notifications";
      await Log("error", "hook", `Failed to load notifications: ${msg}`);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    load();
  }, [load]);

  const markAsRead = async (id: string) => {
    const readIds = getReadIds();
    if (!readIds.includes(id)) {
      readIds.push(id);
      localStorage.setItem("readNotifications", JSON.stringify(readIds));
    }
    await Log("info", "hook", `Notification marked as read id=${id}`);
    setNotifications((prev) =>
      prev.map((n) => (n.ID === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return { notifications, loading, error, markAsRead, unreadCount, totalPages };
}
