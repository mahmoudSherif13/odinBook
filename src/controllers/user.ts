import User from "../models/user";
import { Request, Response, NextFunction } from "express";

export function list(req: Request, res: Response, next: NextFunction): void {
  User.find()
    .exec()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => next(err));
}

export function create(req: Request, res: Response, next: NextFunction): void {
  User.create({
    name: "mahmood",
    email: "mahmoodSherif@gmail.com",
  })
    .then((user) => res.json(user))
    .catch((err) => next(err));
}
