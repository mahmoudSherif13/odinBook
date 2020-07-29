import { Schema, Document, model } from "mongoose";
import { IUser } from "./user";

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    type: {
      type: String,
      enum: ["text"],
      required: true,
    },
    text: String,
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export interface IComment extends Document {
  user: IUser | string;
  type: commentType;
  test: string;
  likes: IUser[];
}

export enum commentType {
  text = "text",
}

export const enum CommentNaming {
  USER = "user",
  TYPE = "type",
  TEXT = "text",
  LIKES = "likes",
  POST = "post",
}
export default model<IComment>("Comment", commentSchema);
