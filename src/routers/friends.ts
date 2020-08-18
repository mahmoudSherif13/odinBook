import { Router } from "express";
import * as friendsController from "../controllers/friends";

const router = Router();

router.get("/", friendsController.friends);

router.get("/requests/", friendsController.requests);
router.put("/requests/:id", friendsController.response);

router.get("/sentRequests/", friendsController.sentRequests);
router.post("/sentRequests/", friendsController.newRequest);
export default router;
