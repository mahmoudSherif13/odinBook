import { Request, Response, NextFunction } from "express";
import { IUser } from "../../models/user";

interface requestWithUser extends Request {
  user?: IUser;
}

export interface controllerFunction {
  (req: requestWithUser, res: Response, next: NextFunction): Promise<void>;
}
