import { validationResult } from "express-validator";
import passport from "passport";
import { body } from "express-validator";
import User, { UserNaming } from "../models/user";
import Post, { PostNaming, postType } from "../models/post";
import * as POST_ERRORS from "../errorCodes";
import { CommentNaming, commentType } from "../models/comment";
import { controllerFunction } from "src/controllers/helper";

const validate: controllerFunction = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
    return;
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push(err.msg));

  res.status(400).json({
    errors: extractedErrors,
  });
};

export const authenticateUser = [
  passport.authenticate("jwt", { session: false }),
];
export const authorize = [];

export const validateUserData = [
  body(UserNaming.NAME)
    .exists()
    .withMessage("messing name")
    .bail()
    .isLength({ min: 3 })
    .withMessage("name must be bigger than 3 chars"),
  body(UserNaming.EMAIL)
    .exists()
    .withMessage("messing email")
    .bail()
    .isEmail()
    .withMessage("invalid email")
    .bail()
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        return Promise.reject();
      }
    })
    .withMessage("used email")
    .escape(),
  body(UserNaming.PASSWORD)
    .exists()
    .withMessage("messing password")
    .notEmpty()
    .withMessage("empty password"),
  body(UserNaming.BIRTHDAY).optional(),
  body(UserNaming.PHOTO_URL).optional().isURL().withMessage("invalid url"),
  validate,
];

export const validatePostData = [
  body(PostNaming.USER)
    .exists()
    .withMessage(POST_ERRORS.MISSING_USER_ID)
    .bail()
    .custom(async (userId) => {
      const user = await User.findById(userId);
      if (!user) {
        return Promise.reject();
      }
    })
    .withMessage(POST_ERRORS.INVALID_USER_ID),
  body(PostNaming.TYPE)
    .exists()
    .withMessage(POST_ERRORS.MISSING_TYPE)
    .bail()
    .custom(async (type) => {
      if (!Object.values(postType).includes(type)) {
        return Promise.reject();
      }
    })
    .withMessage(POST_ERRORS.INVALID_TYPE),
  body(PostNaming.TEXT)
    .exists()
    .withMessage(POST_ERRORS.MISSING_TEXT)
    .bail()
    .notEmpty()
    .withMessage(POST_ERRORS.EMPTY_TEXT),
  validate,
];

export const validateCommentData = [
  body(CommentNaming.USER)
    .exists()
    .withMessage(POST_ERRORS.MISSING_USER_ID)
    .bail()
    .custom(async (userId) => {
      const user = await User.findById(userId);
      if (!user) {
        return Promise.reject();
      }
    })
    .withMessage(POST_ERRORS.INVALID_USER_ID),
  body(CommentNaming.POST)
    .exists()
    .withMessage("missing post Id")
    .bail()
    .custom(async (postId) => {
      const post = await Post.findById(postId);
      if (!post) {
        return Promise.reject();
      }
    })
    .withMessage("invalid post id"),
  body(CommentNaming.TYPE)
    .exists()
    .withMessage(POST_ERRORS.MISSING_TYPE)
    .bail()
    .custom(async (type) => {
      if (!Object.values(commentType).includes(type)) {
        return Promise.reject();
      }
    })
    .withMessage(POST_ERRORS.INVALID_TYPE),
  body(CommentNaming.TEXT)
    .exists()
    .withMessage(POST_ERRORS.MISSING_TEXT)
    .bail()
    .notEmpty()
    .withMessage(POST_ERRORS.EMPTY_TEXT),
  validate,
];

export const validateUserId: controllerFunction = async (req, res, next) => {
  const user = await User.findById(req.params.userId).exec();
  if (!user) {
    res.sendStatus(404);
    return;
  }
  next();
};

export const validatePostId: controllerFunction = async (req, res, next) => {
  const post = await Post.findById(req.params.postId).exec();
  if (!post) {
    res.sendStatus(404);
    return;
  }
  next();
};
