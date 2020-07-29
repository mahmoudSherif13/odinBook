import Comment from "../models/comment";
import { controllerFunction } from "./helper";

export const create: controllerFunction = async (req, res, next) => {
  try {
    const id = (await Comment.create(req.body))._id;
    const comment = await Comment.findById(id)
      .populate("user", "name email photoUrl")
      .exec();
    res.json(comment);
  } catch (err) {
    next(err);
  }
};
