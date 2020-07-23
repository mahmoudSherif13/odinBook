import { Router, NextFunction, Response, Request } from "express";
import * as userController from "../../controllers/user/user";
import { body, validationResult } from "express-validator";
import { UserNameing } from "../../models/user";
import friendRequestRouter from "./friendRequest";
import friendsRouter from "./friends";
import passport from "passport";
const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userController.index
);
router.post("/", validateUserData(), validate, userController.create);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userController.show
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validateUserData(),
  validate,
  userController.update
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userController.destroy
);
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
