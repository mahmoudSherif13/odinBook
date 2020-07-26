import { Schema, Document, model } from "mongoose";
import { IUser } from "./user";

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

postSchema.virtual("url").get(function () {
  return "/posts/" + this._id;
});

postSchema.virtual("baseUrl").get(function () {
  return "/posts/";
});

export interface PostType extends Document {
  user: IUser | string;
  type: postType;
  test: string;
  likes: IUser[];
}

export const enum postType {
  text = "text",
}

export const enum PostNameing {
  USER = "user",
  TYPE = "type",
  TEXT = "text",
  LIKES = "likes",
  BASE_URL = "/posts/",
}
export default model<PostType>("Post", postSchema);
