import { Router } from "express";
import * as postController from "../controllers/post";
import { validatePostData, authenticateUser, validatePostId } from "./helper";
const router = Router();

// validate
router.use("/", authenticateUser);
router.use("/:postId", validatePostId);

router.get("/", postController.index);
router.post("/", validatePostData, postController.create);
router.get("/:postId", postController.show);
router.get("/:postId/comments", postController.getPostComments);
router.post("/:postId/likes", postController.addLike);
export default router;
