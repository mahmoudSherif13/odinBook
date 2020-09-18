import { controllerFunction } from "./helper/types";
import {
  getUserDataByUserId,
  getPostsByUserId,
  getFriendsByUserId,
} from "./helper/getters";
import jwt from "jsonwebtoken";
import passport from "passport";
import dotenv from "dotenv";
import { createUser } from "./helper/creators";
import { UserBaseWithId } from "src/models/user";
dotenv.config();

export const create: controllerFunction = async (req, res, next) => {
  try {
    const userId = await createUser(req.body);
    res.json(await getUserDataByUserId(userId));
  } catch (err) {
    next(err);
  }
};

export const show: controllerFunction = async (req, res, next) => {
  try {
    const user = await getUserDataByUserId(req.params.userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const getUserProfile: controllerFunction = async (req, res, next) => {
  try {
    const user = await getUserDataByUserId(req.user._id);
    const posts = await getPostsByUserId(req.user._id);
    const friends = await getFriendsByUserId(req.user._id);
    res.json({ user, posts, friends });
  } catch (err) {
    next(err);
  }
};

async function generateToken(user: UserBaseWithId): Promise<string> {
  return jwt.sign(JSON.stringify(user), process.env.JWT);
}

export const login: controllerFunction = async (req, res) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: info.message,
        });
      }
      req.login(user, { session: false }, async (err) => {
        if (err) {
          res.send(err);
        }
        const token = await generateToken(user);
        res.json({ user, token });
      });
    }
  )(req, res);
};
