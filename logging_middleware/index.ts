import axios from "axios";

type Stack = "backend" | "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Package =
  | "cache"
  | "controller"
  | "cron_job"
  | "db"
  | "domain"
  | "handler"
  | "repository"
  | "route"
  | "service"
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style"
  | "auth"
  | "config"
  | "middleware"
  | "utils";

export async function Log(stack: Stack, level: Level, pkg: Package, message: string): Promise<void> {
  const token = process.env.AUTH_TOKEN;
  await axios.post(
    "http://4.224.186.213/evaluation-service/logs",
    { stack, level, package: pkg, message },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}
