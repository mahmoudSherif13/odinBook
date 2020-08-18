import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user";
import Post from "../models/post";

interface requestWithUser extends Request {
  user?: IUser;
}

export interface controllerFunction {
  (req: requestWithUser, res: Response, next: NextFunction): Promise<void>;
}

export async function checkUserId(userId: string): Promise<boolean> {
  const user = await User.findById(userId);
  return user ? true : false;
}

export async function checkPostId(postId: string): Promise<boolean> {
  const post = await Post.findById(postId);
  return post ? true : false;
}
