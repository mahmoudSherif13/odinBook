import request from "supertest";
import app from "../app";
import { IUser } from "../models/user";
import { IPost } from "../models/post";
import { v4 as generateUuid } from "uuid";

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
  expect(reserved.user.name).toEqual(expected.user.name);
  expect(reserved.user.email).toEqual(expected.user.email);
  if (expected.user.photoUrl) {
    expect(reserved.user.photoUrl).toEqual(expected.user.photoUrl);
  }
  expect(reserved.type).toEqual(expected.type);
  expect(reserved.data).toEqual(expected.data);
  if (expected.likes) {
    expect(reserved.likes).toEqual(expected.likes);
  }
}

export async function getLoginData(): Promise<{ user: IUser; token: string }> {
  const user = await generateUser();
  const token = (
    await request(app)
      .post("/login/")
      .send({ email: user.email, password: "password" })
  ).body.token;
  return {
    user,
    token,
  };
}

export async function createPost(post, token: string): Promise<IPost> {
  const res = await request(app)
    .post("/posts/")
    .send(post)
    .set("Authorization", "Bearer " + token)
    .expect(200);
  return res.body;
}

export async function generateUser(update = {}): Promise<IUser> {
  const gen = Date.now() + generateUuid();
  const userData = {
    name: gen,
    password: "password",
    email: gen + "@gmail.com",
    photoUrl: "https://www.url.com/photo.jpg",
    birthday: "20-12-2020",
    ...update,
  };
  return (await request(app).post("/users/").send(userData)).body;
}
