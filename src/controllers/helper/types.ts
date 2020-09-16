import { Request, Response, NextFunction } from "express";
import { UserBase } from "../../models/user";

interface requestWithUser extends Request {
  user?: UserBase & { _id: string };
}

export interface controllerFunction {
  (req: requestWithUser, res: Response, next: NextFunction): Promise<void>;
}
