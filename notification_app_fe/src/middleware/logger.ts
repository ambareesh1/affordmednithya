type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Package =
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

export async function Log(level: Level, pkg: Package, message: string): Promise<void> {
  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN || process.env.AUTH_TOKEN;
  try {
    await fetch("http://4.224.186.213/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stack: "frontend", level, package: pkg, message }),
    });
  } catch {
  }
}
