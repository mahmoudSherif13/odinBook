import { Router, Response, Request } from "express";
import userRouter from "./routers/user/user";
import postRouter from "./routers/post";
import passport from "passport";
import auth from "./routers/auth";

const router = Router();

router.use("/users/", userRouter);
router.use("/posts/", postRouter);
router.use("/", auth);

router.use((err, req: Request, res: Response) => {
  if (err) {
    res.status(500).json(err);
  }
});

export default router;
