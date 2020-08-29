import { Router, Response, Request } from "express";
import userRouter from "./routers/user";
import postRouter from "./routers/post";
import friendsRouter from "./routers/friends";
const router = Router();

router.use("/", userRouter);
router.use("/", postRouter);
router.use("/", friendsRouter);
router.use((err, req: Request, res: Response) => {
  if (err) {
    res.status(500).json(err);
  }
});

export default router;
