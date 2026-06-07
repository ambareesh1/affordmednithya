import axios from "axios";
import { Log } from "../middleware/logger";

const BASE_URL = "http://20.244.56.144/evaluation-service/notifications";

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
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  const queryParams: Record<string, string | number> = {};
  if (params.limit) queryParams.limit = params.limit;
  if (params.page) queryParams.page = params.page;
  if (params.notificationType) queryParams.notification_type = params.notificationType;

  const response = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: queryParams,
  });
  return response.data.notifications || response.data || [];
}
