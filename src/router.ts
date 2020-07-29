import { Router, Response, Request } from "express";
import userRouter from "./routers/user";
import postRouter from "./routers/post";
import auth from "./routers/auth";
import commentRouter from "./routers/comments";

const router = Router();

router.use("/users/", userRouter);
router.use("/posts/", postRouter);
router.use("/comments/", commentRouter);
router.use("/", auth);

router.use((err, req: Request, res: Response) => {
  if (err) {
    res.status(500).json(err);
  }
});

export default router;
