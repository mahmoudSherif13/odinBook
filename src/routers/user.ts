import { Router } from "express";
import { authenticateUser, validateUserData } from "./helper";
import * as userController from "../controllers/user";
import * as friendsController from "../controllers/friends";
import * as friendRequestsController from "../controllers/friendRequest";
const router = Router();

router.post("/", validateUserData, userController.create);
router.get("/:userId", authenticateUser, userController.show);
router.get("/:userId/posts", authenticateUser, userController.getUserPosts);

router.get("/:userId/friends/", friendsController.index);

router.get("/:userId/requests/", friendRequestsController.index);
router.post("/:userId/requests/", friendRequestsController.create);
router.put("/:userId/requests/:id", friendRequestsController.accept);
export default router;
