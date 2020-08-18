import { Router } from "express";
import { authenticateUser, validateUserData, validateUserId } from "./helper";
import * as userController from "../controllers/user";

const router = Router();

router.post("/", validateUserData, userController.create);

//validate
router.use("/", authenticateUser);
router.use("/:userId", validateUserId);

router.get("/:userId", userController.show);
router.get("/:userId/posts", userController.getUserPosts);

export default router;
