import Post from "../models/post";
import { controllerFunction } from "./helper/types";
import {
  getPostsByUserId,
  getPostById,
  getCommentsByPostId,
  getPostAndLikesListById,
  getFriendsByUserId,
} from "./helper/helper";

// for testing will be removed soon
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
    const id = (await Post.create({ ...req.body, user: req.user._id }))._id;
    const post = await getPostById(id);
    res.json(post);
  } catch (err) {
    next(err);
  }
};

export const getUserPosts: controllerFunction = async (req, res, next) => {
  try {
    const posts = await getPostsByUserId(req.params.userId);
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

export const show: controllerFunction = async (req, res, next) => {
  try {
    const post = await getPostAndLikesListById(req.params.postId);
    const comments = await getCommentsByPostId(req.params.postId);
    res.json({ ...post.toJSON(), comments });
  } catch (err) {
    next(err);
  }
};

export const getUserFeedPost: controllerFunction = async (req, res, next) => {
  try {
    const userFriends = await getFriendsByUserId(req.user._id);
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
