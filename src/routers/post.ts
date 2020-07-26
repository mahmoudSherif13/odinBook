import { Router } from "express";
import * as postController from "../controllers/post";
const router = Router();

router.get("/", postController.index);
router.post("/", postController.create);
router.get("/:postId", postController.show);
router.put("/:postId", postController.update);
router.delete("/:postId", postController.destroy);

export default router;
