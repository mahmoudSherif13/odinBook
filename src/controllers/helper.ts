import { Request, Response, NextFunction } from "express";

export interface controllerFunction {
  (req: Request, res: Response, next: NextFunction): Promise<void>;
}
