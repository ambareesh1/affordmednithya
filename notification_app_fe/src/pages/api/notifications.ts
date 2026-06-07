import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).end();
    return;
  }

  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  const { limit, page, notification_type } = req.query;

  const params = new URLSearchParams();
  if (limit) params.append("limit", limit as string);
  if (page) params.append("page", page as string);
  if (notification_type) params.append("notification_type", notification_type as string);

  try {
    const response = await fetch(
      `http://4.224.186.213/evaluation-service/notifications?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ notifications: [] });
  }
}
