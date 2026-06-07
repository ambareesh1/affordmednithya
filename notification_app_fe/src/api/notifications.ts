import { Log } from "../middleware/logger";

export interface Notification {
  ID: string;
  Type: "Event" | "Result" | "Placement";
  Message: string;
  Timestamp: string;
  isRead?: boolean;
}

export interface FetchParams {
  limit?: number;
  page?: number;
  notificationType?: string;
}

export async function fetchNotifications(params: FetchParams): Promise<Notification[]> {
  await Log("info", "api", `Fetching notifications params=${JSON.stringify(params)}`);

  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.append("limit", String(params.limit));
  if (params.page) queryParams.append("page", String(params.page));
  if (params.notificationType) queryParams.append("notification_type", params.notificationType);

  const response = await fetch(`/api/notifications?${queryParams.toString()}`);
  const data = await response.json();
  return data.notifications || [];
}
