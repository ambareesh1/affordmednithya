import { useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Navbar from "../components/Navbar";
import PriorityInbox from "../components/PriorityInbox";
import { useNotifications } from "../hooks/useNotifications";
import { Log } from "../middleware/logger";

export default function PriorityPage() {
  const { unreadCount } = useNotifications({ limit: 100, page: 1 });

  useEffect(() => {
    Log("info", "page", "Priority inbox page loaded");
  }, []);

  return (
    <Box>
      <Navbar unreadCount={unreadCount} />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <PriorityInbox />
      </Container>
    </Box>
  );
}
