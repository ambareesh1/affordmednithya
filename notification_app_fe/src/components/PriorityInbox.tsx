import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import NotificationCard from "./NotificationCard";
import { useNotifications } from "../hooks/useNotifications";

const WEIGHTS: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

const TYPES = ["All", "Placement", "Result", "Event"];

export default function PriorityInbox() {
  const [topN, setTopN] = useState(10);
  const [filterType, setFilterType] = useState("All");

  const { notifications, loading, error, markAsRead } = useNotifications({
    limit: 100,
    page: 1,
    notificationType: undefined,
  });

  const prioritized = useMemo(() => {
    let filtered = notifications;
    if (filterType !== "All") {
      filtered = notifications.filter((n) => n.Type === filterType);
    }
    return [...filtered]
      .sort((a, b) => {
        const wa = WEIGHTS[a.Type] || 0;
        const wb = WEIGHTS[b.Type] || 0;
        if (wb !== wa) return wb - wa;
        return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
      })
      .slice(0, topN);
  }, [notifications, topN, filterType]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Priority Inbox
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center", flexWrap: "wrap" }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Show Top</InputLabel>
          <Select
            value={topN}
            label="Show Top"
            onChange={(e) => setTopN(Number(e.target.value))}
          >
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={15}>Top 15</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
          </Select>
        </FormControl>

        <ButtonGroup variant="outlined">
          {TYPES.map((t) => (
            <Button
              key={t}
              onClick={() => setFilterType(t)}
              variant={filterType === t ? "contained" : "outlined"}
            >
              {t}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Typography color="error">{error}</Typography>}

      {!loading &&
        prioritized.map((n, idx) => (
          <NotificationCard
            key={n.ID}
            notification={n}
            onMarkRead={markAsRead}
            rank={idx + 1}
          />
        ))}

      {!loading && prioritized.length === 0 && !error && (
        <Typography color="text.secondary">No notifications found.</Typography>
      )}
    </Box>
  );
}
