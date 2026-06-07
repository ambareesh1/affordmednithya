import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { PORT } from "./config/env";
import { loggerMiddleware } from "./middleware/logger";
import notificationRoutes from "./routes/notifications";

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.use("/api/notifications", notificationRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
