import { UserBase } from "../../models/user";
import { PostBase, postType } from "../../models/post";
import { v4 as generateUuid } from "uuid";
import { CommentBase, commentType } from "../../models/comment";

export function generateUser(update = {}): UserBase {
  const gen = Date.now() + generateUuid();
  const userData = {
    name: gen,
    password: "password",
    email: gen + "@gmail.com",
    photoUrl: "https://www.url.com/photo.jpg",
    birthday: "20-12-2020",
    ...update,
  };
  return userData;
}

export function generatePost(update = {}): PostBase {
  const gen = Date.now() + generateUuid();
  const postData = {
    type: postType.text,
    text: "post text : " + gen,
    ...update,
  };
  return postData;
}

export function generateComment(update = {}): CommentBase {
  const gen = Date.now() + generateUuid();
  const commentData = {
    type: commentType.text,
    text: "comment text : " + gen,
    ...update,
  };
  return commentData;
}
