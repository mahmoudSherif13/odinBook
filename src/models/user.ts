import { Schema, Document, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
    photoUrl: String,
    birthday: String,
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    sentFriendRequests: [
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

userSchema.virtual("url").get(function () {
  return "/users/" + this._id;
});

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  photoUrl?: string;
  birthday?: string;
  friends?: IUser[] | string[];
  friendRequests?: IUser[] | string[];
  sentFriendRequests?: IUser[] | string[];
  //time stamps
  createdAt?: Date;
  updatedAt?: Date;
}

export const enum UserNaming {
  NAME = "name",
  EMAIL = "email",
  BIRTHDAY = "birthday",
  PHOTO_URL = "photoUrl",
  PASSWORD = "password",
  FRIENDS = "friends",
  FRIEND_REQUESTS = "friendRequests",
  SENT_FRIEND_REQUESTS = "sentFriendRequests",
}

export default model<IUser>("User", userSchema);
