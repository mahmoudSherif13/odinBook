import { Router, NextFunction, Response, Request } from "express";
import * as friends from "../controllers/friends";
import { body, validationResult } from "express-validator";
const router = Router();

router.get("/:userId/friends/", friends.index);
router.delete("/:userId/friends/:id", friends.destroy);

function validateUserData() {
  return [];
}

function validate(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
}

export default router;
