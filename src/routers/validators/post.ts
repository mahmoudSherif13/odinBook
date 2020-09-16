import { body } from "express-validator";
import Post, { postType } from "../../models/post";
import { commentType } from "../../models/comment";
import { validate } from "./helper";
import { controllerFunction } from "../../controllers/helper/types";

export const validatePostData = [
  body("type")
    .exists()
    .withMessage("missing type")
    .bail()
    .custom(async (type) => {
      if (!Object.values(postType).includes(type)) {
        return Promise.reject();
      }
    })
    .withMessage("invalid type"),
  body("text")
    .exists()
    .withMessage("missing text")
    .bail()
    .notEmpty()
    .withMessage("empty text"),
  validate,
];

export const validateCommentData = [
  body("type")
    .exists()
    .withMessage("missing type")
    .bail()
    .custom(async (type) => {
      if (!Object.values(commentType).includes(type)) {
        return Promise.reject();
      }
    })
    .withMessage("invalid type"),
  body("text")
    .exists()
    .withMessage("missing type")
    .bail()
    .notEmpty()
    .withMessage("empty text"),
  validate,
];

export const validatePostId: controllerFunction = async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    res.sendStatus(404);
    return;
  }
  next();
};
