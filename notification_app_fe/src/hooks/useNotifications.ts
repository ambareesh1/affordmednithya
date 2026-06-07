import { useState, useEffect, useCallback } from "react";
import { fetchNotifications, Notification, FetchParams } from "../api/notifications";

export function useNotifications(params: FetchParams = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getReadIds = (): string[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("readNotifications");
    return stored ? JSON.parse(stored) : [];
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const data = await fetchNotifications(params);
    const readIds = getReadIds();
    const withRead = data.map((n) => ({ ...n, isRead: readIds.includes(n.id) }));
    setNotifications(withRead);
    setLoading(false);
  }, [JSON.stringify(params)]);

  useEffect(() => {
    load().catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  }, [load]);

  const markAsRead = (id: string) => {
    const readIds = getReadIds();
    if (!readIds.includes(id)) {
      readIds.push(id);
      localStorage.setItem("readNotifications", JSON.stringify(readIds));
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return { notifications, loading, error, markAsRead, unreadCount };
}
