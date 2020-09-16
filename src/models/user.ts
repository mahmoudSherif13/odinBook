import { Schema, Document, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
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
    versionKey: false,
  }
);

export interface UserBase {
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  photoUrl?: string;
  birthday?: string;
  friends?: IUser[] | string[];
  friendRequests?: IUser[] | string[];
  sentFriendRequests?: IUser[] | string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser extends Document, UserBase {}

export default model<IUser>("User", userSchema);
