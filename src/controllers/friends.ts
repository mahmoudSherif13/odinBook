import { controllerFunction } from "./helper/types";
import {
  getFriendsByUserId,
  getSentFriendRequestsByUserId,
  getFriendRequestsByUserId,
} from "./helper/getters";
import {
  createFriendRequest,
  responseToFriendRequest,
} from "./helper/creators";

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
    await createFriendRequest(req.user._id, req.body.userId);
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
    await responseToFriendRequest(
      req.user._id,
      req.params.userId,
      req.body.response
    );
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
