import User from "../models/user";
import Post from "../models/post";
import { Request, Response, NextFunction } from "express";
import { userNotFounded } from "../errorCodes";
import * as bcrypt from "bcryptjs";
import { controllerFunction } from "./helper";

export async function create(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userData = req.body;
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const user = await User.create(userData);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function show(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json(userNotFounded);
    }
  } catch (err) {
    next(err);
  }
}

export const getUserPosts: controllerFunction = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).exec();
    if (!user) {
      res.sendStatus(404);
      return;
    }
    const posts = await Post.find({ user: req.params.id }).exec();
    res.json(posts);
  } catch (err) {
    next(err);
  }
};
