import React from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { Notification } from "../api/notifications";

interface NotificationCardProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
}

const typeColors: Record<string, "primary" | "success" | "warning"> = {
  Placement: "primary",
  Result: "success",
  Event: "warning",
};

export default function NotificationCard({ notification, onMarkRead }: NotificationCardProps) {
  return (
    <Card
      sx={{ mb: 2, opacity: notification.isRead ? 0.75 : 1, cursor: "pointer" }}
      onClick={() => onMarkRead && onMarkRead(notification.id)}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Chip label={notification.type} color={typeColors[notification.type] || "default"} size="small" />
          {!notification.isRead && (
            <Chip label="NEW" color="error" size="small" />
          )}
        </Box>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {notification.message}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {notification.timestamp}
        </Typography>
      </CardContent>
    </Card>
  );
}
