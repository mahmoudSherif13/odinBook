import { Router } from "express";
import {
  authenticateUser,
  validateUserData,
  validateUserId,
} from "./validators/user";
import * as userController from "../controllers/user";

const router = Router({});
router.post("/login/", userController.login);
router.post("/users/", validateUserData, userController.create);
//validate
router.use("/users/", authenticateUser);
router.use("/users/:userId", validateUserId);
router.get("/users/:userId", userController.show);
router.get("/profile/", authenticateUser, userController.getUserProfile);
export default router;
