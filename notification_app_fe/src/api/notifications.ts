import axios from "axios";
import { Log } from "../middleware/logger";

const BASE_URL = "http://4.224.186.213/evaluation-service/notifications";

export interface Notification {
  id: string;
  type: "Event" | "Result" | "Placement";
  message: string;
  timestamp: string;
  isRead?: boolean;
}

export interface FetchParams {
  limit?: number;
  page?: number;
  notification_type?: string;
}

export async function fetchNotifications(params: FetchParams): Promise<Notification[]> {
  await Log("info", "api", `Fetching notifications with params: ${JSON.stringify(params)}`);
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN || process.env.AUTH_TOKEN;
  const response = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return response.data;
}
