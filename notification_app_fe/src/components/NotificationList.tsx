import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import NotificationCard from "./NotificationCard";
import { useNotifications } from "../hooks/useNotifications";

const TYPES = ["All", "Placement", "Result", "Event"];
const PAGE_SIZE = 10;

export default function NotificationList() {
  const [selectedType, setSelectedType] = useState("All");
  const [page, setPage] = useState(1);

  const filterType = selectedType === "All" ? undefined : selectedType;
  const { notifications, loading, error, markAsRead, totalPages } = useNotifications({
    limit: PAGE_SIZE,
    page,
    notificationType: filterType,
  });

  function handleTypeChange(type: string) {
    setSelectedType(type);
    setPage(1);
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        All Notifications
      </Typography>

      <ButtonGroup sx={{ mb: 3 }} variant="outlined">
        {TYPES.map((t) => (
          <Button
            key={t}
            onClick={() => handleTypeChange(t)}
            variant={selectedType === t ? "contained" : "outlined"}
          >
            {t}
          </Button>
        ))}
      </ButtonGroup>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Typography color="error">{error}</Typography>}

      {!loading &&
        notifications.map((n) => (
          <NotificationCard key={n.ID} notification={n} onMarkRead={markAsRead} />
        ))}

      {!loading && notifications.length === 0 && !error && (
        <Typography color="text.secondary">No notifications found.</Typography>
      )}

      {totalPages > 1 && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
