import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { Notification } from "../api/notifications";

interface NotificationCardProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
  rank?: number;
}

const typeColors: Record<string, "primary" | "success" | "warning"> = {
  Placement: "primary",
  Result: "success",
  Event: "warning",
};

export default function NotificationCard({ notification, onMarkRead, rank }: NotificationCardProps) {
  return (
    <Card
      sx={{
        mb: 2,
        opacity: notification.isRead ? 0.7 : 1,
        cursor: "pointer",
        border: notification.isRead ? "1px solid #e0e0e0" : "1px solid #1976d2",
      }}
      onClick={() => onMarkRead && onMarkRead(notification.ID)}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {rank && (
              <Chip label={`#${rank}`} size="small" variant="outlined" />
            )}
            <Chip
              label={notification.Type}
              color={typeColors[notification.Type] || "default"}
              size="small"
            />
          </Box>
          {!notification.isRead && (
            <Chip label="NEW" color="error" size="small" />
          )}
        </Box>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {notification.Message}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {notification.Timestamp}
        </Typography>
      </CardContent>
    </Card>
  );
}
