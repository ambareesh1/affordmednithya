import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || "5000";
export const AUTH_TOKEN = process.env.AUTH_TOKEN || "";
