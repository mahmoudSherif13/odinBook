import { controllerFunction } from "./helper/types";
import { getLikesByPostId } from "./helper/getters";
import { addLike } from "./helper/creators";

export const create: controllerFunction = async (req, res, next) => {
  try {
    addLike(req.params.postId, req.user._id);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

export const show: controllerFunction = async (req, res, next) => {
  try {
    const likesList = await getLikesByPostId(req.params.postId);
    res.json(likesList);
  } catch (err) {
    next(err);
  }
};
