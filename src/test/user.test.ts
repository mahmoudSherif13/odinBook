import request from "supertest";
import app from "../app";
import User from "../models/user";
import { invalidId } from "./helper/testData";
import {
  generateDbUser,
  generateDbUserAndGetToken,
  getToken,
  generateDbPost,
  generateDbFriend,
} from "./helper/helper";
import {
  expectPosts,
  expectUsers,
  expectUser,
  expectUserFormat,
} from "./helper/expect";
import { generateUser } from "./helper/generators";
import mongoose from "mongoose";
import { connect } from "../dbConfigs/testing";

beforeAll(connect);

afterAll(() => {
  mongoose.connection.close();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("sign in POST /login", () => {
  it("OK 200", async () => {
    const user = await generateDbUser({ password: "password" });
    const res = await request(app)
      .post("/login/")
      .send({
        email: user.email,
        password: "password",
      })
      .expect(200);
    expect(res.body.token).toBeDefined();
    expectUserFormat(res.body.user);
  });

  it("wrong password", async () => {
    const user = await generateDbUser();
    await request(app)
      .post("/login/")
      .send({
        email: user.email,
        password: "wrong pass",
      })
      .expect(400);
  });

  it("wrong email", async () => {
    const user = await generateDbUser();
    await request(app)
      .post("/login/")
      .send({
        email: "wrong email",
        password: user.password,
      })
      .expect(400);
  });
});

describe("sign up POST /users", () => {
  it("OK 200", async () => {
    const userData = generateUser();
    const res = await request(app).post("/users/").send(userData).expect(200);
    expectUserFormat(res.body);
    const dbUser = await User.find({ email: userData.email });
    expect(dbUser).toBeDefined();
  });

  it("same user", async () => {
    const userData = generateUser();
    await request(app).post("/users/").send(userData).expect(200);
    await request(app).post("/users/").send(userData).expect(400);
  });

  it("creat invalid email", async () => {
    const userData = generateUser();
    await request(app)
      .post("/users/")
      .send({
        ...userData,
        email: "mm..a",
      })
      .expect(400);
  });

  it("create invalid password", async () => {
    const userData = generateUser();
    await request(app)
      .post("/users/")
      .send({
        ...userData,
        password: undefined,
      })
      .expect(400);
  });

  it("create empty user", async () => {
    await request(app).post("/users/").send({}).expect(400);
  });
});

describe("current user profile GET /profile", () => {
  it("OK 200", async () => {
    // populate the database
    const { user, token } = await generateDbUserAndGetToken();
    const posts = [
      await generateDbPost(user),
      await generateDbPost(user),
      await generateDbPost(user),
    ];
    const friends = [
      await generateDbFriend(user),
      await generateDbFriend(user),
      await generateDbFriend(user),
    ];

    const res = await request(app)
      .get("/profile/")
      .set("Authorization", "Bearer " + token)
      .expect(200);
    expectUser(res.body.user, user);
    expectPosts(res.body.posts, posts);

    expectUsers(res.body.friends, friends);
  });

  it("check auth", async () => {
    await request(app).get("/profile/").expect(401);
  });
});

describe("show user data GET /users/{userId}/", () => {
  it("show user", async () => {
    const user = await generateDbUser();

    const res = await request(app)
      .get("/users/" + user._id)
      .set("Authorization", "Bearer " + (await getToken()))
      .expect(200);
    expectUser(res.body, user);
  });

  it("not auth", async () => {
    const user = await generateDbUser();
    await request(app)
      .get("/users/" + user._id)
      .expect(401);
  });

  it("invalid id", async () => {
    await request(app)
      .get("/users/" + invalidId)
      .set("Authorization", "Bearer " + (await getToken()))
      .expect(404);
  });
});
