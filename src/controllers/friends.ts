import User from "../models/user";
import { controllerFunction } from "./helper/types";
import {
  getFriendsByUserId,
  getSentFriendRequestsByUserId,
  getFriendRequestsByUserId,
} from "./helper/helper";

export const listUserFriends: controllerFunction = async (req, res, next) => {
  try {
    const friends = await getFriendsByUserId(req.user._id);
    res.json(friends);
  } catch (err) {
    next(err);
  }
};

export const createRequest: controllerFunction = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, {
      $addToSet: { friendRequests: req.user._id },
    }).exec();
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { sentFriendRequests: req.body.userId },
    }).exec();

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

export const listSentRequests: controllerFunction = async (req, res, next) => {
  try {
    const sentFriendRequests = await getSentFriendRequestsByUserId(
      req.user._id
    );
    res.json(sentFriendRequests);
  } catch (err) {
    next(err);
  }
};

export const listRequests: controllerFunction = async (req, res, next) => {
  try {
    const friendRequests = await getFriendRequestsByUserId(req.user._id);
    res.json(friendRequests);
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
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
