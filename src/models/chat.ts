import { Schema, Document, model } from "mongoose";
import { IUser } from "./user";

const messageSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    state: {
      type: String,
      enum: ["hold", "received", "read"],
      required: true,
    },
    type: {
      type: String,
      enum: ["text"],
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

export interface IMessage extends Document {
  user: IUser | string;
  state: messageState;
  type: messageType;
  text: string;
}

export interface IChat extends Document {
  users: IUser[] | string[];
  messages: IMessage[];
}

export enum messageType {
  text = "text",
}

export enum messageState {
  hold = "hold",
  received = "received",
  read = "read",
}
export default model<IChat>("Chat", chatSchema);
