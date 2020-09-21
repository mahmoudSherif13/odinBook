import request from "supertest";
import app from "../../app";
import User, { UserBaseWithId } from "../../models/user";
import Post, { PostBaseWithId } from "../../models/post";
import Comment, { CommentBaseWithId } from "../../models/comment";
import Chat, { ChatBaseWithId, MessageBaseWithId } from "../../models/chat";
import {
  generateComment,
  generateUser,
  generatePost,
  generateMessage,
} from "./generators";
import {
  addLike,
  creatComment,
  createChat,
  createFriendRequest,
  createMessage,
  createPost,
  createUser,
  responseToFriendRequest,
} from "../../controllers/helper/creators";
import {
  getChatById,
  getCommentById,
  getPostById,
  getUserById,
} from "../../controllers/helper/getters";

export async function generateDbUser(update = {}): Promise<UserBaseWithId> {
  const userData = generateUser(update);
  const userId = await createUser(userData);
  const user = await getUserById(userId);
  return user;
}

export async function generateDbFriend(
  user: UserBaseWithId,
  update = {}
): Promise<UserBaseWithId> {
  const friend = await generateDbUser(update);
  await createFriendRequest(user._id, friend._id);
  await responseToFriendRequest(friend._id, user._id, "accept");
  return friend;
}

export async function generateDbFriendRequest(
  user: UserBaseWithId,
  friend?: UserBaseWithId,
  update = {}
): Promise<UserBaseWithId> {
  if (!friend) {
    friend = await generateDbUser(update);
  }
  await createFriendRequest(friend._id, user._id);
  return friend;
}

export async function getToken(user?: UserBaseWithId): Promise<string> {
  if (user === undefined) {
    user = await generateDbUser();
  }
  const res = await request(app)
    .post("/login/")
    .send({ email: user.email, password: "password" })
    .expect(200);
  return res.body.token;
}

export async function generateDbUserAndGetToken(): Promise<{
  user: UserBaseWithId;
  token: string;
}> {
  const user = await generateDbUser();
  const token = await getToken(user);
  return { user, token };
}

export async function generateDbPost(
  user?: UserBaseWithId,
  update = {}
): Promise<PostBaseWithId> {
  if (!user) {
    user = await generateDbUser();
  }
  const postData = generatePost(update);
  postData.user = user._id;
  const postId = await createPost(postData);
  const post = await getPostById(postId);
  return post;
}

export async function generateDbComment(
  user?: UserBaseWithId,
  post?: PostBaseWithId,
  update = {}
): Promise<CommentBaseWithId> {
  if (!user) {
    user = await generateDbUser();
  }
  if (!post) {
    post = await generateDbPost(user);
  }
  const commentData = generateComment(update);
  commentData.user = user._id;
  commentData.post = post._id;
  const commentId = await creatComment(commentData);
  const comment = await getCommentById(commentId);
  return comment;
}

export async function generateDbLike(
  user?: UserBaseWithId,
  post?: PostBaseWithId
): Promise<void> {
  if (!user) {
    user = await generateDbUser();
  }
  if (!post) {
    post = await generateDbPost(user);
  }
  await addLike(post._id, user._id);
}

export async function generateDbChat(
  user: UserBaseWithId,
  friend?: UserBaseWithId
): Promise<ChatBaseWithId> {
  if (!friend) {
    friend = await generateDbUser();
  }
  const chatId = await createChat(user._id, friend._id);
  const chat = await getChatById(chatId);
  return chat;
}

export async function generateDbMessage(
  chat: ChatBaseWithId,
  user: UserBaseWithId,
  update = {}
): Promise<MessageBaseWithId> {
  const messageData = generateMessage(update);
  messageData.user = user._id;
  return createMessage(chat._id, messageData);
}

export async function clearDataBase(): Promise<void> {
  await Post.deleteMany({});
  await User.deleteMany({});
  await Comment.deleteMany({});
  await Chat.deleteMany({});
}
