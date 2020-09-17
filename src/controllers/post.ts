import { controllerFunction } from "./helper/types";
import {
  getPostsByUserId,
  getPostById,
  getCommentsByPostId,
  getFeedPostsByUserId,
} from "./helper/getters";
import { createPost } from "./helper/creators";

export const create: controllerFunction = async (req, res, next) => {
  try {
    const id = await createPost({ ...req.body, user: req.user._id });
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
    const post = await getPostById(req.params.postId);
    const comments = await getCommentsByPostId(req.params.postId);
    res.json({ ...post, comments });
  } catch (err) {
    next(err);
  }
};

export const getUserFeedPost: controllerFunction = async (req, res, next) => {
  try {
    const postList = await getFeedPostsByUserId(req.user._id);
    res.json(postList);
  } catch (err) {
    next(err);
  }
};
