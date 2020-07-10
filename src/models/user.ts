import { Schema, Document, model } from "mongoose";

const userSchema = new Schema({
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
},{
  timestamps: true,
});

userSchema.virtual("url").get(function () {
  return "/users/" + this._id;
});

export interface UserType extends Document {
  name: string;
  email: string;
  photoUrl: string;
  birthday: string;
}

export const enum UserNameing{
  NAME = "name",
  EMAIL = "email",
  BIRTHDAY = "birthday",
  PHOTO_URL = "photoUrl",
};

export default model<UserType>("User", userSchema);
