import User from "../models/user";
import { controllerFunction } from "./helper";

export const index: controllerFunction = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("friends", "name email photoUrl")
      .exec();
    if (user) {
      res.json(user.friends);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
};
