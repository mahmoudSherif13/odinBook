import { Router, NextFunction, Response, Request } from "express";
import * as postController from "../controllers/post";
import { body, validationResult } from "express-validator";
import { PostNameing } from "../models/post";
const router = Router();

router.get("/", postController.index);
router.post("/", validatePostData(), validate, postController.create);
router.get("/:id", postController.show);
router.put("/:id", validatePostData(), validate, postController.update);
router.delete("/:id", postController.destroy);

function validatePostData() {
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
