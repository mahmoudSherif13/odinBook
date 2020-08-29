import User from "../models/user";
import * as bcrypt from "bcryptjs";
import { controllerFunction } from "./helper/types";
import {
  getUserDataByUserId,
  getPostsByUserId,
  getFriendsByUserId,
} from "./helper/helper";
import jwt from "jsonwebtoken";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

export const create: controllerFunction = async (req, res, next) => {
  try {
    const userData = req.body;
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const userId = (await User.create(userData))._id;
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

export const login: controllerFunction = async (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info.message,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      jwt.sign(JSON.stringify(user), process.env.JWT, (err, token) => {
        if (err) {
          return res.status(404).json(err);
        }
        return res.json({ user, token });
      });
    });
  })(req, res);
};
