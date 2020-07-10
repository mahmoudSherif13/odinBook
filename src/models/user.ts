import mongoose, { Schema, Document } from "mongoose";

const userSchema = new Schema({
  name: String,
  email: String,
});

userSchema.virtual("url").get(function () {
  return "/users/" + this._id;
});

export interface UserType extends Document {
  name: string;
  email: string;
}

export default mongoose.model<UserType>("User", userSchema);
