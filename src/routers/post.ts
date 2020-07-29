import { Router } from "express";
import * as postController from "../controllers/post";
import { validatePostData, authenticateUser } from "./helper";
const router = Router();

router.get("/", authenticateUser, postController.index);
router.post("/", authenticateUser, validatePostData, postController.create);
router.get("/:postId", authenticateUser, postController.show);
router.get(
  "/:postId/comments",
  authenticateUser,
  postController.getPostComments
);
export default router;
