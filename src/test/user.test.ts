import request from "supertest";
import app from "../app";
import User from "../models/user";
import { users, invalidId } from "./testdata";
import { expectUser, expectPost } from "./helper";
import mongoose from "mongoose";
import { connect } from "../mongoConfigTesting";

const userData = {
  name: "jone",
  email: "jone@gmail.com",
  password: "pass",
  photoUrl: "https://www.url.com/photo.jpg",
  birthday: "20-12-2020",
};
const postData = {
  type: "text",
  text: "a very boring post",
  user: "",
};

beforeAll(connect);

afterAll(() => {
  mongoose.connection.close();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("auth", () => {
  xit("normal", async () => {
    const user = (await request(app).post("/users/").send(userData)).body;
    const res = await request(app).post("/login/").send({
      email: userData.email,
      password: userData.password,
    });
  });
});

describe("create", () => {
  it("create user", async () => {
    const res = await request(app).post("/users/").send(userData).expect(200);
    expectUser(res.body, userData);
    const dbUser = await User.findById(res.body._id).exec();
    expectUser(dbUser, userData);
  });

  it("create the same user", async () => {
    await request(app).post("/users").send(userData).expect(200);
    await request(app).post("/users").send(userData).expect(400);
  });

  it("creat invalid email", async () => {
    await request(app)
      .post("/users/")
      .send({
        ...userData,
        email: "mm..a",
      })
      .expect(400);
  });

  it("create invalid password", async () => {
    await request(app)
      .post("/users/")
      .send({
        ...userData,
        password: undefined,
      })
      .expect(400);
  });

  it("create invalid user", async () => {
    await request(app).post("/users/").send({}).expect(400);
  });
});

describe("show", () => {
  it("show user", async () => {
    const user = (await request(app).post("/users/").send(userData).expect(200))
      .body;

    const loginRes = await request(app)
      .post("/login/")
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect(200);

    const res = await request(app)
      .get("/users/" + user._id)
      .set("Authorization", "Bearer " + loginRes.body.token)
      .expect(200);
    expectUser(res.body, user);
  });

  it("not auth", async () => {
    const user = (await request(app).post("/users/").send(users[0]).expect(200))
      .body;

    await request(app)
      .get("/users/" + user._id)
      .expect(401);
  });

  it("invalid id", async () => {
    await request(app).post("/users/").send(userData).expect(200);

    const loginRes = await request(app)
      .post("/login/")
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect(200);

    await request(app)
      .get("/users/" + invalidId)
      .set("Authorization", "Bearer " + loginRes.body.token)
      .expect(404);
  });
});

describe("get user posts", () => {
  it("get empty list", async () => {
    const user = (await request(app).post("/users/").send(userData).expect(200))
      .body;
    const token = (
      await request(app)
        .post("/login/")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200)
    ).body.token;
    const res = await request(app)
      .get("/users/" + user._id + "/posts/")
      .set("Authorization", "Bearer " + token)
      .expect(200);
    expect(res.body).toHaveLength(0);
  });

  it("get posts", async () => {
    const user = (await request(app).post("/users/").send(userData).expect(200))
      .body;
    const token = (
      await request(app)
        .post("/login/")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200)
    ).body.token;
    const postList = [
      {
        ...postData,
        user: user._id,
      },
      {
        user: user._id,
        type: "text",
        text: "lol",
      },
    ];
    await request(app)
      .post("/posts/")
      .send(postList[0])
      .set("Authorization", "Bearer " + token)
      .expect(200);
    await request(app)
      .post("/posts/")
      .send(postList[1])
      .set("Authorization", "Bearer " + token)
      .expect(200);
    const res = await request(app)
      .get("/users/" + user._id + "/posts/")
      .set("Authorization", "Bearer " + token)
      .expect(200);

    for (let i = 0; i < postList.length; i++) {
      expectPost(res.body[i], postList[i]);
    }
  });

  it("get posts with invalid id", async () => {
    await request(app).post("/users/").send(userData).expect(200);
    const token = (
      await request(app)
        .post("/login/")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200)
    ).body.token;
    await request(app)
      .get("/users/" + invalidId + "/posts/")
      .set("Authorization", "Bearer " + token)
      .expect(404);
  });
});
