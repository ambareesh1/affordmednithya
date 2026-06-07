import mongoose from "mongoose";
import { MONGODB_URI } from "./env";
import { Log } from "../../../logging_middleware/index";

export async function connectDB(): Promise<void> {
  await mongoose.connect(MONGODB_URI);
  await Log("backend", "info", "db", "MongoDB connected successfully");
}
