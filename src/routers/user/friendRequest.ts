import { Router, NextFunction, Response, Request } from "express";
import * as friendRequest from "../../controllers/user/friendRequest";
import { body, validationResult } from "express-validator";
const router = Router();

router.get("/:userId/requests/", friendRequest.index);
router.post(
  "/:userId/requests/",
  validateUserData(),
  validate,
  friendRequest.create
);
router.delete("/:userId/requests/:id", friendRequest.destroy);
router.put("/:userId/requests/:id", friendRequest.accept);

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
