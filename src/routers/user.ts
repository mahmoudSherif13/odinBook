import { Router } from "express";
import {
  validate,
  authenticateUser,
  authorize,
  validateUserData,
} from "./helper";

import * as userController from "../controllers/user";

import friendRequestRouter from "./friendRequest";
import friendsRouter from "./friends";

const router = Router();

router.get("/", authenticateUser, userController.index);
router.post("/", validateUserData, validate, userController.create);
router.get("/:id", authenticateUser, userController.show);
router.put(
  "/:id",
  authenticateUser,
  validateUserData,
  validate,
  userController.update
);
router.delete("/:id", authenticateUser, authorize, userController.destroy);
router.use("/", friendRequestRouter);
router.use("/", friendsRouter);

export default router;
