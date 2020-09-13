import { controllerFunction } from "./helper/types";
import Chat, { messageState } from "../models/chat";
import { MESSAGE_SELECTOR } from "./helper/selectors";
import { getChatsByUserId, getChatById } from "./helper/getters";

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
    const dbChat = await Chat.findOne({
      users: { $all: [req.user._id, req.body.userId] },
    });
    if (dbChat) {
      res.sendStatus(400);
      return;
    }
    const chatId = (
      await Chat.create({
        users: [req.user._id, req.body.userId],
      })
    )._id;
    const chat = await getChatById(chatId);
    res.json(chat);
  } catch (err) {
    next(err);
  }
};

export const createMessage: controllerFunction = async (req, res, next) => {
  try {
    await Chat.findByIdAndUpdate(req.params.chatId, {
      $push: {
        messages: {
          type: req.body.type,
          text: req.body.text,
          user: req.user._id,
          state: messageState.hold,
        },
      },
    });
    const chat = await Chat.findById(req.params.chatId, MESSAGE_SELECTOR).slice(
      "messages",
      -1
    );
    res.json(chat.messages[0]);
  } catch (err) {
    next(err);
  }
};
