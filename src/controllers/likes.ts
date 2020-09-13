import Post from "../models/post";
import { controllerFunction } from "./helper/types";
import { getLikesByPostId } from "./helper/getters";

export const create: controllerFunction = async (req, res, next) => {
  try {
    await Post.findByIdAndUpdate(req.params.postId, {
      $addToSet: { likes: req.user._id },
    });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

export const show: controllerFunction = async (req, res, next) => {
  try {
    const likesList = await getLikesByPostId(req.params.postId);
    res.json(likesList.likes);
  } catch (err) {
    next(err);
  }
};
