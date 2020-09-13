import { Router, Response, Request } from "express";
import userRouter from "./routers/user";
import postRouter from "./routers/post";
import chatRouter from "./routers/chat";
import friendsRouter from "./routers/friends";
import * as chatController from "./controllers/chat";
const router = Router();

router.use("/", userRouter);
router.use("/", postRouter);
router.use("/", friendsRouter);
router.use("/", chatRouter);
router.use((err, req: Request, res: Response) => {
  if (err) {
    res.status(500).json(err);
  }
});

export default router;
