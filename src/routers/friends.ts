import { Router } from "express";
import * as friendsController from "../controllers/friends";
import {
  authenticateUser,
  validateFriendRequestData,
  validateFriendRequestId,
} from "./validators/user";

const router = Router();

router.use("/friends/", authenticateUser);
router.get("/friends/", friendsController.listUserFriends);

router.get("/friends/requests/", friendsController.listRequests);
router.post(
  "/friends/requests/",
  validateFriendRequestData,
  friendsController.createRequest
);
router.put(
  "/friends/requests/:userId",
  validateFriendRequestId,
  friendsController.response
);
router.get("/friends/requests/sent", friendsController.listSentRequests);
export default router;
