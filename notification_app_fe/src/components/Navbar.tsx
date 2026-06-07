import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "next/link";

type NavbarProps = {
  unreadCount: number;
};

export default function Navbar({ unreadCount }: NavbarProps) {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Badge badgeContent={unreadCount} color="error" sx={{ mr: 2 }}>
          <NotificationsIcon />
        </Badge>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Campus Notifications
        </Typography>
        <Box>
          <Link href="/" passHref legacyBehavior>
            <Button color="inherit">All</Button>
          </Link>
          <Link href="/priority" passHref legacyBehavior>
            <Button color="inherit">Priority Inbox</Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
