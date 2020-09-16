import { Router } from "express";
import * as chatController from "../controllers/chat";
import {
  validateChatId,
  validateChatData,
  validateMessageData,
} from "./validators/chat";
import { authenticateUser } from "./validators/user";

const router = Router();

router.use("/chats/", authenticateUser);
router.use("/chats/:chatId", validateChatId);

router.get("/chats/", chatController.index);
router.post("/chats/", validateChatData, chatController.create);

router.get("/chats/:chatId", chatController.show);

router.post(
  "/chats/:chatId/messages/",
  validateMessageData,
  chatController.createMessage
);

export default router;
