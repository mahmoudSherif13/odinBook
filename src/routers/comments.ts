import { Router } from "express";
import * as commentsController from "../controllers/comment";
import { validateCommentData, authenticateUser } from "./helper";
const router = Router();

router.post(
  "/",
  authenticateUser,
  validateCommentData,
  commentsController.create
);

export default router;
