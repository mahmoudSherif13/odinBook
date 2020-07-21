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
    photoUrl: String,
    birthday: String,
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendsRequests: [
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
  photoUrl?: string;
  birthday?: string;
  friends?: IUser[] | string[];
  friendsRequests?: IUser[] | string[];

  //time stamps
  createdAt?: Date;
  updatedAt?: Date;

  // virtual
  url?: string;
}

export const enum UserNameing {
  NAME = "name",
  EMAIL = "email",
  BIRTHDAY = "birthday",
  PHOTO_URL = "photoUrl",
}

export default model<IUser>("User", userSchema);
