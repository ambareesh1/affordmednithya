import http from "http";

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
  const body = JSON.stringify({ stack, level, package: pkg, message });
  return new Promise((resolve) => {
    const req = http.request(
      {
        host: "4.224.186.213",
        path: "/evaluation-service/logs",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          Authorization: `Bearer ${token}`,
        },
      },
      (res) => {
        res.resume();
        res.on("end", resolve);
      }
    );
    req.on("error", () => resolve());
    req.write(body);
    req.end();
  });
}
