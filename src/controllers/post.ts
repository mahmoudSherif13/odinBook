import Post from "../models/post";
import { controllerFunction } from "./helper";

export const create: controllerFunction = async (req, res, next) => {
  try {
    const post = await Post.create(req.body);
    res.json(post);
  } catch (err) {
    next(err);
  }
};

export const show: controllerFunction = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId).exec();
    if (post) {
      res.json(post);
    }
    res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};
