import { useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Navbar from "../components/Navbar";
import NotificationList from "../components/NotificationList";
import { useNotifications } from "../hooks/useNotifications";
import { Log } from "../middleware/logger";

export default function HomePage() {
  const { unreadCount } = useNotifications({ limit: 100, page: 1 });

  useEffect(() => {
    Log("info", "page", "Home page loaded");
  }, []);

  return (
    <Box>
      <Navbar unreadCount={unreadCount} />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <NotificationList />
      </Container>
    </Box>
  );
}
