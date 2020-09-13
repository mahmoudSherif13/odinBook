import { controllerFunction } from "./helper/types";
import Chat, { messageState } from "../models/chat";

const MESSAGE_SELECTOR =
  "messages._id messages.user messages.type messages.text messages.state ";
const CHAT_SELECTOR = "_id users messages ";

export const index: controllerFunction = async (req, res, next) => {
  try {
    const chats = await Chat.find({ users: req.user._id }, CHAT_SELECTOR).slice(
      "messages",
      -1
    );
    const chatsArr = [];
    chats.forEach((chat) => {
      chatsArr.push({
        _id: chat._id,
        users: chat.users,
        lastMessage: chat.messages[0],
      });
    });
    res.json(chatsArr);
  } catch (err) {
    next(err);
  }
};

export const show: controllerFunction = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.chatId, CHAT_SELECTOR);
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
    const chat = await Chat.findById(chatId, CHAT_SELECTOR);
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
