import { Router, Response, Request } from "express";
import userRouter from "./routers/user";
import postRouter from "./routers/post";
import chatRouter from "./routers/chat";
import friendsRouter from "./routers/friends";
import { dbPop } from "./dbConfigs/dbPopulate";
const router = Router();

router.use("/", userRouter);
router.use("/", postRouter);
router.use("/", friendsRouter);
router.use("/", chatRouter);
router.post("/dbPopulate", dbPop);
router.post("/dbClear");
router.use((err, req: Request, res: Response) => {
  if (err) {
    res.status(500).json(err);
  }
});

export default router;
