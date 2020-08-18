import User from "../models/user";
import Post from "../models/post";
import * as bcrypt from "bcryptjs";
import { controllerFunction } from "./helper";

export const create: controllerFunction = async (req, res, next) => {
  try {
    const userData = req.body;
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const user = await User.create(userData);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const show: controllerFunction = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const getUserPosts: controllerFunction = async (req, res, next) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate("user", "name email photoUrl")
      .exec();
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

export const getUserFeedPost: controllerFunction = async (req, res, next) => {
  try {
    const userFriends = (
      await User.findById(req.params.userId, "friends").exec()
    ).friends;
    const postList = await Post.find({ user: { $in: userFriends } })
      .populate("user", "name email photoUrl")
      .sort({
        createdAt: 1,
      })
      .exec();
    res.json(postList);
  } catch (err) {
    next(err);
  }
};
