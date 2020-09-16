import { UserBase } from "../../models/user";
import { PostBase, postType } from "../../models/post";
import { v4 as generateUuid } from "uuid";
import { CommentBase, commentType } from "../../models/comment";
import { messageType, messageState } from "../../models/chat";

export function generateUser(update = {}): UserBase {
  const gen = Date.now() + generateUuid();
  const userData: UserBase = {
    firstName: gen,
    lastName: gen,
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
  const postData: PostBase = {
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

export function generateMessage(update = {}) {
  const gen = Date.now() + generateUuid();
  const messageDate = {
    type: messageType.text,
    states: messageState.hold,
    text: gen,
    ...update,
  };
  return messageDate;
}
