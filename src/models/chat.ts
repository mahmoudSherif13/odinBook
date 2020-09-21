import { Schema, Document, model } from "mongoose";
import { IUser } from "./user";

export enum messageType {
  text = "text",
}

export enum messageState {
  hold = "hold",
  received = "received",
  read = "read",
}

const messageSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    state: {
      type: String,
      enum: Object.values(messageState),
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(messageType),
      required: true,
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const chatSchema = new Schema({
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: messageSchema,
    },
  ],
});

export interface MessageBase {
  user?: IUser | string;
  state: messageState;
  type: messageType;
  text: string;
}

export interface ChatBase {
  users: IUser[] | string[];
  messages?: MessageBaseWithId[];
}

export interface ChatBaseWithId extends ChatBase {
  _id: IChat["_id"];
}

export interface MessageBaseWithId extends MessageBase {
  _id: IMessage["_id"];
}

export interface IMessage extends Document, MessageBase {}

export interface IChat extends Document, ChatBase {}

export default model<IChat>("Chat", chatSchema);
