import request from "supertest";
import app from "../app";
import User, { IUser } from "../models/user";
import Post from "../models/post";
import { expectPost } from "./helper";
import * as POST_ERRORS from "../errors/post";
import { connect } from "../mongoConfigTesting";
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

beforeAll(connect);

afterEach(async () => {
  await Post.deleteMany({});
  await User.deleteMany({});
});

async function getLoginData(): Promise<{ user: IUser; token: string }> {
  const user = (await request(app).post("/users/").send(userData)).body;
  const token = (
    await request(app)
      .post("/login/")
      .send({ email: userData.email, password: userData.password })
  ).body.token;
  return {
    user,
    token,
  };
}

async function createPost(post, token: string) {
  const res = await request(app)
    .post("/posts/")
    .send(post)
    .set("Authorization", "Bearer " + token)
    .expect(200);
  return res.body;
}

describe("create", () => {
  it("create valid post", async () => {
    const { user, token } = await getLoginData();
    const post = {
      ...postData,
      user: user._id,
    };
    const addedPost = await createPost(post, token);
    expectPost(addedPost, {
      ...post,
      user: user,
    });
    // check db
    const dbPost = await Post.findById(addedPost._id)
      .populate("user", "name email photoUrl")
      .exec();
    expectPost(dbPost, {
      ...post,
      user: user,
    });
  });

  it("create post without auth", async () => {
    await request(app).post("/posts/").send(postData).expect(401);
  });

  it("create post without user", async () => {
    const token = (await getLoginData()).token;
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
    const { user, token } = await getLoginData();
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
    const { user, token } = await getLoginData();
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
    const { user, token } = await getLoginData();
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
    expectPost(res.body, {
      ...post,
      user: user,
    });
  });

  it("show invalid id", async () => {
    const token = (await getLoginData()).token;
    await request(app)
      .get("/posts/" + invalidId)
      .set("Authorization", "Bearer " + token)
      .expect(404);
  });

  it("show unAuthorized", async () => {
    const { user, token } = await getLoginData();

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

describe("post likes", () => {
  it("add like", async () => {
    const { user, token } = await getLoginData();
    const post = await createPost(
      {
        ...postData,
        user: user._id,
      },
      token
    );

    await request(app)
      .post("/posts/" + post._id + "/likes/")
      .send({ user: user._id })
      .set("Authorization", "Bearer " + token)
      .expect(200);

    const dbPost = await Post.findById(post._id, "likes").exec();
    expect(dbPost.likes).toHaveLength(1);
    expect(dbPost.likes[0].toString()).toEqual(user._id.toString());
  });
  it("add the same like", async () => {
    const { user, token } = await getLoginData();
    const post = await createPost(
      {
        ...postData,
        user: user._id,
      },
      token
    );

    await request(app)
      .post("/posts/" + post._id + "/likes/")
      .send({ user: user._id })
      .set("Authorization", "Bearer " + token)
      .expect(200);

    await request(app)
      .post("/posts/" + post._id + "/likes/")
      .send({ user: user._id })
      .set("Authorization", "Bearer " + token)
      .expect(200);

    const dbPost = await Post.findById(post._id, "likes").exec();
    expect(dbPost.likes).toHaveLength(1);
    expect(dbPost.likes[0].toString()).toEqual(user._id.toString());
  });
});
