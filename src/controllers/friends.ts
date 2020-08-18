import User from "../models/user";
import { controllerFunction } from "./helper";
import { body } from "express-validator";

export const friends: controllerFunction = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("friends", "name email photoUrl")
      .exec();
    res.json(user.friends);
  } catch (err) {
    next(err);
  }
};

export const newRequest: controllerFunction = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, {
      $addToSet: { friendRequests: req.user._id },
    }).exec();
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { sentFriendRequests: req.body.userId },
    }).exec();

    res.json({ message: "OK" });
  } catch (err) {
    next(err);
  }
};

export const sentRequests: controllerFunction = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id, "sentFriendRequests").exec();
    res.json(user.sentFriendRequests);
  } catch (err) {
    next(err);
  }
};

export const requests: controllerFunction = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id, "friendRequests").exec();
    res.json(user.friendRequests);
  } catch (err) {
    next(err);
  }
};

export const response: controllerFunction = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { friendRequests: req.params.userId },
    });
    await User.findByIdAndUpdate(req.params.userId, {
      $pull: { sentFriendRequests: req.user._id },
    });

    if (req.body.response === "accept") {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { friends: req.params.userId },
      });
      await User.findByIdAndUpdate(req.params.userId, {
        $addToSet: { friends: req.user._id },
      });
    }
    res.json({ message: "OK" });
  } catch (err) {
    next(err);
  }
};
