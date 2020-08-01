import { Request, Response, NextFunction } from "express";
import User from "../models/user";

export interface controllerFunction {
  (req: Request, res: Response, next: NextFunction): Promise<void>;
}

export async function checkUserId(userId: string): Promise<boolean> {
  const user = await User.findById(userId);
  return user ? true : false;
}
