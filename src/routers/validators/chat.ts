import { body } from "express-validator";
import User from "../../models/user";
import Chat, { messageType } from "../../models/chat";
import { validate } from "./helper";
import { controllerFunction } from "../../controllers/helper/types";

export const validateChatData = [
  body("userId")
    .exists()
    .withMessage("messing userId")
    .custom(async (userId) => {
      const user = await User.findById(userId);
      if (!user) {
        return Promise.reject();
      }
    })
    .withMessage("invalid userId")
    .exists(),
  validate,
];

export const validateMessageData = [
  body("type")
    .exists()
    .withMessage("messing type")
    .bail()
    .custom(async (type) => {
      if (!Object.values(messageType).includes(type)) {
        return Promise.reject();
      }
    })
    .withMessage("invalid message type"),
  body("text")
    .exists()
    .withMessage("messing text")
    .bail()
    .notEmpty()
    .withMessage("empty text"),
  validate,
];

export const validateChatId: controllerFunction = async (req, res, next) => {
  const chat = await Chat.findById(req.params.chatId, "_id");
  if (!chat) {
    res.status(404);
    return;
  }
  next();
};
