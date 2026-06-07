import { Router } from "express";
import { getAllNotifications, markNotificationAsRead, getUnreadNotificationCount } from "../controllers/notificationController";
import { Log } from "../../../logging_middleware/index";

const router = Router();

router.use(async (req, res, next) => {
  await Log("backend", "info", "route", `Route hit: ${req.method} ${req.path}`);
  next();
});

router.get("/", getAllNotifications);
router.get("/unread-count", getUnreadNotificationCount);
router.patch("/:id/read", markNotificationAsRead);

export default router;
