import Post from "../models/post";
import Comment from "../models/comment";
import { controllerFunction } from "./helper";

// for testing will be removed in the next version
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
    res.json(post);
  } catch (err) {
    next(err);
  }
};

export const addLike: controllerFunction = async (req, res, next) => {
  try {
    await Post.findByIdAndUpdate(req.params.postId, {
      $addToSet: { likes: req.body.user },
    });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

export const getPostComments: controllerFunction = async (req, res, next) => {
  try {
    const commentsList = await Comment.find({ post: req.params.postId })
      .populate("user", "name email photoUrl")
      .exec();
    res.json(commentsList);
  } catch (err) {
    next(err);
  }
};
