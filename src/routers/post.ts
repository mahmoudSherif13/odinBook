import { Router } from "express";
import * as postController from "../controllers/post";
import { validatePostData, authenticateUser } from "./helper";
const router = Router();

router.post("/", authenticateUser, validatePostData, postController.create);
router.get("/:postId", authenticateUser, postController.show);

export default router;
