import User from "../models/user";
import { Request, Response, NextFunction } from "express";
import { controllerFunction, checkUserId } from "./helper";

export const index: controllerFunction = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("friendsRequests", "name email photoUrl")
      .exec();
    if (user) {
      res.json(user.friendsRequests);
      return;
    }
    res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};

export const create: controllerFunction = async (req, res, next) => {
  try {
    if (
      !(await checkUserId(req.params.userId)) ||
      !(await checkUserId(req.body.user))
    ) {
      res.sendStatus(404);
      return;
    }

    await User.findByIdAndUpdate(req.params.userId, {
      $addToSet: { friendsRequests: req.body.user },
    }).exec();

    res.json({ message: "OK" });
  } catch (err) {
    next(err);
  }
};

export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    await User.findByIdAndUpdate(req.params.userId, {
      $pull: { friendsRequests: req.params.id },
    }).exec();
    res.json({ done: "delete done" });
  } catch (err) {
    next(err);
  }
}

export async function accept(req: Request, res: Response, next: NextFunction) {
  try {
    await User.findByIdAndUpdate(req.params.userId, {
      $pull: { friendsRequests: req.params.id },
      $addToSet: { friends: req.params.id },
    }).exec();

    res.json("done");
  } catch (err) {
    next(err);
  }
}
