import { Router } from "express";
import {
  validatePostData,
  validatePostId,
  validateCommentData,
} from "./validators/post";
import { authenticateUser } from "./validators/user";
import * as postController from "../controllers/post";
import * as commentsController from "../controllers/comments";
import * as likesController from "../controllers/likes";

const router = Router();

router.use("/posts/", authenticateUser);
router.use("/posts/:postId", validatePostId);

router.get("/posts/", postController.index);
router.post("/posts/", validatePostData, postController.create);
router.get("/posts/:postId", postController.show);

router.get("/users/:userId/posts", postController.getUserPosts);
router.get("/feed/", authenticateUser, postController.getUserFeedPost);

// likes
router.get("/posts/:postId/likes", likesController.show);
router.post("/posts/:postId/likes", likesController.create);

// comments
router.get("/posts/:postId/comments", commentsController.show);
router.post(
  "/posts/:postId/comments",
  authenticateUser,
  validateCommentData,
  commentsController.create
);

export default router;
