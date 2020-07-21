import { Router, NextFunction, Response, Request } from "express";
import * as userController from "../../controllers/user/user";
import { body, validationResult } from "express-validator";
import { UserNameing } from "../../models/user";
import friendRequestRouter from "./friendRequest";
import friendsRouter from "./friends";
const router = Router();

router.get("/", userController.index);
router.post("/", validateUserData(), validate, userController.create);
router.get("/:id", userController.show);
router.put("/:id", validateUserData(), validate, userController.update);
router.delete("/:id", userController.destroy);

router.use("/", friendRequestRouter);
router.use("/", friendsRouter);

function validateUserData() {
  return [
    body(UserNameing.NAME).trim().escape(),
    body(UserNameing.EMAIL).isEmail().escape(),
    body(UserNameing.BIRTHDAY).escape(),
    body(UserNameing.PHOTO_URL).optional().isURL().escape(),
  ];
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
