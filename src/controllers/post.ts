import Post from "../models/post";
import { controllerFunction } from "./helper";

export const index: controllerFunction = async (req, res, next) => {
  try {
    const postsList = await Post.find().exec();
    if (postsList?.length) {
      res.json(postsList);
    }
    res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};

export const create: controllerFunction = async (req, res, next) => {
  try {
    const post = await Post.create(req.body);
    res.json(post);
  } catch (err) {
    next(err);
  }
};

export const show: controllerFunction = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).exec();
    if (post) {
      res.json(post);
    }
    res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};

export const update: controllerFunction = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body).exec();
    if (post) {
      res.json(post);
    }
    res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};

export const destroy: controllerFunction = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id).exec();
    if (post) {
      res.json(post);
    }
    res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};
