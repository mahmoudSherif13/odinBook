import request from "supertest";
import app from "../app";
import User from "../models/user";
import Post from "../models/post";
import { expectPost } from "./helper";
import * as POST_ERRORS from "../errors/post";
import "../mongoConfigTesting";
import { invalidId } from "./testdata";

const postData = {
  type: "text",
  text: "a very boring post",
  user: "",
};
const userData = {
  name: "poor jone",
  email: "jone@lol.xd",
  password: "123456",
};

afterEach(async () => {
  await Post.deleteMany({});
  await User.deleteMany({});
});

describe("create", () => {
  it("create valid post", async () => {
    const user = await (
      await request(app).post("/users/").send(userData).expect(200)
    ).body;
    const token = (
      await request(app)
        .post("/login/")
        .send({ email: userData.email, password: userData.password })
        .expect(200)
    ).body.token;
    const popPost = {
      ...postData,
      user: user._id,
    };
    const res = await request(app)
      .post("/posts/")
      .send(popPost)
      .set("Authorization", "Bearer " + token)
      .expect(200);
    expectPost(res.body, popPost);
    // check db
    const post = await Post.findById(res.body._id).exec();
    expectPost(post, popPost);
  });

  it("create post without auth", async () => {
    await request(app).post("/posts/").send(postData).expect(401);
  });

  it("create post without user", async () => {
    await request(app).post("/users/").send(userData).expect(200);
    const token = (
      await request(app)
        .post("/login/")
        .send({ email: userData.email, password: userData.password })
        .expect(200)
    ).body.token;
    await request(app)
      .post("/posts/")
      .send({
        ...postData,
        user: undefined,
      })
      .set("Authorization", "Bearer " + token)
      .expect(400)
      .expect({ errors: [POST_ERRORS.MISSING_USER_ID] });
  });

  it("create post without type and text", async () => {
    const user = await (
      await request(app).post("/users/").send(userData).expect(200)
    ).body;
    const token = (
      await request(app)
        .post("/login/")
        .send({ email: userData.email, password: userData.password })
        .expect(200)
    ).body.token;
    await request(app)
      .post("/posts/")
      .send({
        ...postData,
        user: user._id,
        type: undefined,
        text: undefined,
      })
      .set("Authorization", "Bearer " + token)
      .expect(400)
      .expect({
        errors: [POST_ERRORS.MISSING_TYPE, POST_ERRORS.MISSING_TEXT],
      });
  });

  it("create post with invalid type and text", async () => {
    const user = await (
      await request(app).post("/users/").send(userData).expect(200)
    ).body;
    const token = (
      await request(app)
        .post("/login/")
        .send({ email: userData.email, password: userData.password })
        .expect(200)
    ).body.token;
    await request(app)
      .post("/posts/")
      .send({
        ...postData,
        user: user._id,
        type: " oh yah",
        text: "",
      })
      .set("Authorization", "Bearer " + token)
      .expect(400)
      .expect({
        errors: [POST_ERRORS.INVALID_TYPE, POST_ERRORS.EMPTY_TEXT],
      });
  });
});

describe("show", () => {
  it("show post", async () => {
    const user = await (
      await request(app).post("/users/").send(userData).expect(200)
    ).body;
    const token = (
      await request(app)
        .post("/login/")
        .send({ email: userData.email, password: userData.password })
        .expect(200)
    ).body.token;

    const post = (
      await request(app)
        .post("/posts/")
        .set("Authorization", "Bearer " + token)
        .send({
          ...postData,
          user: user._id,
        })
        .expect(200)
    ).body;
    const res = await request(app)
      .get("/posts/" + post._id)
      .set("Authorization", "Bearer " + token)
      .expect(200);
    expectPost(res.body, post);
  });

  it("show invalid id", async () => {
    await (await request(app).post("/users/").send(userData).expect(200)).body;
    const token = (
      await request(app)
        .post("/login/")
        .send({ email: userData.email, password: userData.password })
        .expect(200)
    ).body.token;
    await request(app)
      .get("/posts/" + invalidId)
      .set("Authorization", "Bearer " + token)
      .expect(404);
  });

  it("show unAuthorized", async () => {
    const user = await (
      await request(app).post("/users/").send(userData).expect(200)
    ).body;

    const token = (
      await request(app)
        .post("/login/")
        .send({ email: userData.email, password: userData.password })
        .expect(200)
    ).body.token;

    const post = (
      await request(app)
        .post("/posts/")
        .send({
          ...postData,
          user: user._id,
        })
        .set("Authorization", "Bearer " + token)
        .expect(200)
    ).body;

    await request(app)
      .get("/posts/" + post._id)
      .expect(401);
  });
});
