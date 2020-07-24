import User from "../../models/user";
import { Request, Response, NextFunction } from "express";
import { userNotFounded } from "../../errorCodes";
import * as bcrypt from "bcryptjs";

export function index(req: Request, res: Response, next: NextFunction): void {
  User.find()
    .exec()
    .then((users) => res.json(users))
    .catch((err) => next(err));
}

export async function create(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userData = req.body;
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  userData.password = hashedPassword;
  try {
    const user = await User.create(userData);
    res.json(user);
  } catch (err) {
    next(err);
  }
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

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const userData = req.body;
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;
    }
    const user = await User.findByIdAndUpdate(req.params.id, userData);
    if (user) {
      res.json(user);
    }
    res.status(404).json(userNotFounded);
  } catch (err) {
    next(err);
  }
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
