import { controllerFunction } from "./helper/types";
import { MessageBase, messageState } from "../models/chat";
import { getChatsByUserId, getChatById } from "./helper/getters";
import {
  checkIfChatCreated,
  createChat,
  createMessage,
} from "./helper/creators";

export const index: controllerFunction = async (req, res, next) => {
  try {
    const chats = await getChatsByUserId(req.user._id);
    res.json(chats);
  } catch (err) {
    next(err);
  }
};

export const show: controllerFunction = async (req, res, next) => {
  try {
    const chat = await getChatById(req.params.chatId);
    res.json(chat);
  } catch (err) {
    next(err);
  }
};

export const create: controllerFunction = async (req, res, next) => {
  try {
    if (!(await checkIfChatCreated(req.user._id, req.body.userId))) {
      const chatId = await createChat(req.user._id, req.body.userId);
      const chat = await getChatById(chatId);
      res.json(chat);
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    next(err);
  }
};

export const newMessage: controllerFunction = async (req, res, next) => {
  try {
    const messageData: MessageBase = {
      type: req.body.type,
      text: req.body.text,
      user: req.user._id,
      state: messageState.hold,
    };
    res.json(createMessage(req.params.chatId, messageData));
  } catch (err) {
    next(err);
  }
};
