import User from "../../models/user";
import { Request, Response, NextFunction } from "express";
import { userNotFounded } from "../../errorCodes";

export function index(req: Request, res: Response, next: NextFunction): void {
  User.find()
    .exec()
    .then((users) => res.json(users))
    .catch((err) => next(err));
}

export function create(req: Request, res: Response, next: NextFunction): void {
  User.create(req.body)
    .then((user) => res.json(user))
    .catch((err) => next(err));
}

export function show(req: Request, res: Response, next: NextFunction): void {
  User.findById(req.params.id)
    .exec()
    .then((user) => {
      if (user) {
        res.json(user);
      }
      res.status(404).json(userNotFounded);
    })
    .catch((err) => next(err));
}

export function update(req: Request, res: Response, next: NextFunction): void {
  User.findByIdAndUpdate(req.params.id, req.body)
    .exec()
    .then((user) => {
      if (user) {
        res.json(user);
      }
      res.status(404).json(userNotFounded);
    })
    .catch((err) => next(err));
}

export function destroy(req: Request, res: Response, next: NextFunction): void {
  User.findByIdAndDelete(req.params.id)
    .exec()
    .then((user) => {
      if (user) {
        res.json(user);
      }
      res.status(404).json(userNotFounded);
    })
    .catch((err) => next(err));
}
