import { Request, Response, NextFunction } from "express";
import { Log } from "../../../logging_middleware/index";

export async function loggerMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  await Log("backend", "info", "middleware", `${req.method} ${req.url}`);
  next();
}
