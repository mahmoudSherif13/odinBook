import { validationResult } from "express-validator";
import { NextFunction, Response, Request } from "express";
import passport from "passport";
import { body } from "express-validator";
import User, { UserNaming } from "../models/user";

export function validate(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push(err.msg));

  return res.status(400).json({
    errors: extractedErrors,
  });
}

export const authenticateUser = [
  passport.authenticate("jwt", { session: false }),
];
export const authorize = [];
export const validateUserData = [
  body(UserNaming.NAME)
    .trim()
    .escape()
    .exists()
    .withMessage("messing name")
    .isLength({ min: 3 })
    .withMessage("name must be bigger than 3 chars"),
  body(UserNaming.EMAIL)
    .exists()
    .withMessage("messing email")
    .isEmail()
    .withMessage("invalid email")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        return Promise.reject();
      }
    })
    .withMessage("used email")
    .escape(),
  body(UserNaming.PASSWORD).exists().withMessage("messing password"),
  body(UserNaming.BIRTHDAY).optional().escape(),
  body(UserNaming.PHOTO_URL).optional().isURL().escape(),
];
