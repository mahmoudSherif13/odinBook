import request from "supertest";
import app from "../app";
import { IUser, UserBase } from "../models/user";
import { IPost, PostBase, postType } from "../models/post";
import { v4 as generateUuid } from "uuid";
import { IComment, CommentBase, commentType } from "../models/comment";
import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";

// expect
export function expectUser(reserved, expected): void {
  expect(reserved._id).toBeDefined();
  expect(reserved.name).toEqual(expected.name);
  expect(reserved.email).toEqual(expected.email);
  if (expected.photoUrl) {
    expect(reserved.photoUrl).toBeDefined();
  }
  if (expected.birthday) {
    expect(reserved.birthday).toEqual(expected.birthday);
  }
}

export function expectPost(reserved, expected): void {
  expect(reserved._id).toBeDefined();
  expect(reserved.user._id.toString()).toEqual(expected.user._id.toString());
  expect(reserved.type).toEqual(expected.type);
  expect(reserved.text).toEqual(expected.text);
}

export function expectUsers(reserved, expected): void {
  for (let i = 0; i < expected.length; i++) {
    expectUser(reserved[i], expected[i]);
  }
}

export function expectPosts(reserved, expected): void {
  for (let i = 0; i < expected.length; i++) {
    expectPost(reserved[i], expected[i]);
  }
}

export function expectComment(reserved, expected): void {
  expect(reserved._id).toBeDefined();
  expect(reserved.user._id.toString()).toEqual(expected.user._id.toString());
  expect(reserved.post.toString()).toEqual(expected.post.toString());
  expect(reserved.type).toEqual(expected.type);
  expect(reserved.text).toEqual(expected.text);
}

export function expectComments(reserved, expected): void {
  for (let i = 0; i < expected.length; i++) {
    expectComment(reserved[i], expected[i]);
  }
}

// generators
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

// creation
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

/**
 * @param user if user is undefined function will generate one
 */
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

export async function clearDataBase(): Promise<void> {
  await Post.deleteMany({});
  await User.deleteMany({});
  await Comment.deleteMany({});
}
