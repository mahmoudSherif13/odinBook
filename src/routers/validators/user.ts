import passport from "passport";
import { body } from "express-validator";
import User from "../../models/user";
import { controllerFunction } from "../../controllers/helper/types";
import { validate } from "./helper";

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

export const authenticateUser = [
  passport.authenticate("jwt", { session: false }),
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

export const validateUserId: controllerFunction = async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    res.sendStatus(404);
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
