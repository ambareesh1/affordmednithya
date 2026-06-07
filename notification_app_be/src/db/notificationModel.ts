import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  id: string;
  type: "Event" | "Result" | "Placement";
  message: string;
  timestamp: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ["Event", "Result", "Placement"], required: true },
  message: { type: String, required: true },
  timestamp: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<INotification>("Notification", NotificationSchema);
