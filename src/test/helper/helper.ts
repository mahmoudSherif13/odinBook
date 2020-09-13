import request from "supertest";
import app from "../../app";
import User, { IUser } from "../../models/user";
import Post, { IPost } from "../../models/post";
import Comment, { IComment } from "../../models/comment";
import Chat, { IMessage, IChat } from "../../models/chat";
import {
  generateComment,
  generateUser,
  generatePost,
  generateMessage,
} from "./generators";

export async function createUser(update = {}): Promise<IUser> {
  const userData = generateUser(update);
  return (await request(app).post("/users/").send(userData)).body;
}

export async function createFriend(user: IUser, update = {}): Promise<IUser> {
  const friend = await createUser(update);
  await User.findByIdAndUpdate(user._id, {
    $addToSet: { friends: friend._id },
  });
  await User.findByIdAndUpdate(friend._id, {
    $addToSet: { friends: user._id },
  });
  return friend;
}

export async function createFriendRequest(
  resUser: IUser,
  senUser?: IUser,
  update = {}
): Promise<IUser> {
  if (!senUser) {
    senUser = await createUser(update);
  }
  await User.findByIdAndUpdate(resUser._id, {
    $addToSet: { friendRequests: senUser._id },
  });
  await User.findByIdAndUpdate(senUser._id, {
    $addToSet: { sentFriendRequests: resUser._id },
  });
  return senUser;
}

export async function getToken(user?: IUser): Promise<string> {
  if (user === undefined) {
    user = await createUser();
  }
  const res = await request(app)
    .post("/login/")
    .send({ email: user.email, password: "password" })
    .expect(200);
  return res.body.token;
}

export async function createUserAndGetToken(): Promise<{
  user: IUser;
  token: string;
}> {
  const user = await createUser();
  const token = await getToken(user);
  return { user, token };
}

export async function createPost(user?: IUser, update = {}): Promise<IPost> {
  if (!user) {
    user = await createUser();
  }
  const token = await getToken(user);
  const postData = generatePost(update);
  const res = await request(app)
    .post("/posts/")
    .send(postData)
    .set("Authorization", "Bearer " + token)
    .expect(200);
  return res.body;
}

export async function createComment(
  user?: IUser,
  post?: IPost,
  update = {}
): Promise<IComment> {
  if (!user) {
    user = await createUser();
  }
  if (!post) {
    post = await createPost(user);
  }
  const token = await getToken(user);
  const commentData = generateComment(update);
  const res = await request(app)
    .post("/posts/" + post._id + "/comments")
    .send(commentData)
    .set("Authorization", "Bearer " + token)
    .expect(200);
  return res.body;
}

export async function createLike(
  user?: IUser,
  post?: IPost,
  update = {}
): Promise<void> {
  if (!user) {
    user = await createUser();
  }
  if (!post) {
    post = await createPost(user);
  }
  const token = await getToken(user);
  await request(app)
    .post("/posts/" + post._id + "/likes")
    .set("Authorization", "Bearer " + token)
    .expect(200);
}

export async function createChat(
  senUser: IUser,
  resUser?: IUser,
  update = {}
): Promise<IChat> {
  if (!resUser) {
    resUser = await createUser();
  }
  const token = await getToken(senUser);
  const chatData = {
    user: resUser._id,
    ...update,
  };
  const res = await request(app)
    .post("/chat/")
    .send(chatData)
    .set("Authorization", "Bearer " + token)
    .expect(200);
  return res.body;
}

export async function createMessage(
  chat: IChat,
  user: IUser,
  update = {}
): Promise<IMessage> {
  const token = await getToken(user);
  const messageData = generateMessage(update);
  const res = await request(app)
    .post(`/chats/${chat._id}/messages/`)
    .send(messageData)
    .set("Authorization", "Bearer " + token)
    .expect(200);
  return res.body;
}

export async function clearDataBase(): Promise<void> {
  await Post.deleteMany({});
  await User.deleteMany({});
  await Comment.deleteMany({});
  await Chat.deleteMany({});
}
