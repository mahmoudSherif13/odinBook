import Comment from "../models/comment";
import { getCommentById, getCommentsByPostId } from "./helper/getters";
import { controllerFunction } from "./helper/types";

export const create: controllerFunction = async (req, res, next) => {
  try {
    const commentData = {
      ...req.body,
      user: req.user._id,
      post: req.params.postId,
    };
    const id = (await Comment.create(commentData))._id;
    const comment = await getCommentById(id);
    res.json(comment);
  } catch (err) {
    next(err);
  }
};

export const show: controllerFunction = async (req, res, next) => {
  try {
    const commentsList = await getCommentsByPostId(req.params.postId);
    res.json(commentsList);
  } catch (err) {
    next(err);
  }
};
