import { validationResult } from "express-validator";
import passport from "passport";
import { body } from "express-validator";
import User from "../models/user";
import Post, { PostNaming, postType } from "../models/post";
import Chat, { messageType } from "../models/chat";
import * as POST_ERRORS from "../errorCodes";
import { CommentNaming, commentType } from "../models/comment";
import { controllerFunction } from "../controllers/helper/types";

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

export const validateUserData = [
  body("firstName")
    .exists()
    .withMessage("messing first name")
    .bail()
    .isLength({ min: 3 })
    .withMessage("name must be bigger than 3 chars"),
  body("lastName")
    .exists()
    .withMessage("messing first name")
    .bail()
    .isLength({ min: 3 })
    .withMessage("name must be bigger than 3 chars"),
  body("email")
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
  body("password")
    .exists()
    .withMessage("messing password")
    .notEmpty()
    .withMessage("empty password"),
  body("birthday").optional(),
  body("photoUrl").optional().isURL().withMessage("invalid url"),
  validate,
];

export const validatePostData = [
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

export const validateFriendRequestData = [
  body("userId")
    .exists()
    .withMessage("messing userId")
    .custom(async (userId) => {
      const user = await User.findById(userId);
      if (!user) {
        return Promise.reject();
      }
    })
    .withMessage("invalid userId")
    .escape(),
  validate,
];

export const validateChatData = [
  body("userId")
    .exists()
    .withMessage("messing userId")
    .custom(async (userId) => {
      const user = await User.findById(userId);
      if (!user) {
        return Promise.reject();
      }
    })
    .withMessage("invalid userId")
    .exists(),
  validate,
];

export const validateMessageData = [
  body("type")
    .exists()
    .withMessage("messing type")
    .bail()
    .custom(async (type) => {
      if (!Object.values(messageType).includes(type)) {
        return Promise.reject();
      }
    })
    .withMessage("invalid message type"),
  body("text")
    .exists()
    .withMessage("messing text")
    .bail()
    .notEmpty()
    .withMessage("empty text"),
  validate,
];

export const validateUserId: controllerFunction = async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }
  next();
};

export const validatePostId: controllerFunction = async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    res.sendStatus(404);
    return;
  }
  next();
};

export const validateChatId: controllerFunction = async (req, res, next) => {
  const chat = await Chat.findById(req.params.chatId, "_id");
  if (!chat) {
    res.status(404);
    return;
  }
  next();
};

export const validateFriendRequestId: controllerFunction = async (
  req,
  res,
  next
) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }
  next();
};
