import { Router } from "express";
import { authenticateUser, validateUserData } from "./helper";

import * as userController from "../controllers/user";

const router = Router();

router.post("/", validateUserData, userController.create);
router.get("/:id", authenticateUser, userController.show);
router.get("/:id/posts", authenticateUser, userController.getUserPosts);

export default router;
