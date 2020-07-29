import Post from "../models/post";
import Comment, { commentType } from "../models/comment";
import { controllerFunction } from "./helper";

export const index: controllerFunction = async (req, res, next) => {
  try {
    const postList = await Post.find({})
      .populate("user", "name email photoUrl")
      .exec();
    res.json(postList);
  } catch (err) {
    next(err);
  }
};

export const create: controllerFunction = async (req, res, next) => {
  try {
    const id = (await Post.create(req.body))._id;
    const post = await Post.findById(id)
      .populate("user", "name email photoUrl")
      .exec();
    res.json(post);
  } catch (err) {
    next(err);
  }
};

export const show: controllerFunction = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("user", "name email photoUrl")
      .exec();
    if (post) {
      res.json(post);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
};

export const getPostComments: controllerFunction = async (req, res, next) => {
  try {
    const postId = await Post.findById(req.params.postId).exec();
    if (!postId) {
      res.sendStatus(404);
    } else {
      const commentsList = await Comment.find({ post: req.params.postId })
        .populate("user", "name email photoUrl")
        .exec();
      res.json(commentsList);
    }
  } catch (err) {
    next(err);
  }
};
