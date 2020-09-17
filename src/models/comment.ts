import { Schema, Document, model } from "mongoose";
import { IUser } from "./user";

export enum commentType {
  text = "text",
}

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
      enum: Object.values(commentType),
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

export interface CommentBase {
  type: commentType;
  text: string;

  user?: IUser | string;
  post?: string;
  likes?: IUser[];
}

export interface CommentBaseWithId extends CommentBase {
  _id: IComment["_id"];
}

export type IComment = Document & CommentBase;

export default model<IComment>("Comment", commentSchema);
