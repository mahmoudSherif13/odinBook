import {
  createPost,
  createUserAndGetToken,
  getToken,
  clearDataBase,
  createUser,
  createLike,
} from "./helper/helper";
import { expectUsers } from "./helper/expect";
import request from "supertest";
import app from "../app";
import { invalidId } from "./helper/testData";
import { connect } from "../dbConfigs/testing";
import Post from "../models/post";

beforeAll(connect);

afterEach(clearDataBase);

describe("create like POST /posts/postId/likes", () => {
  it("200 OK", async () => {
    const { user, token } = await createUserAndGetToken();
    const post = await createPost(user);
    await request(app)
      .post("/posts/" + post._id + "/likes/")
      .set("Authorization", "Bearer " + token)
      .expect(200);

    const dbLikes = (await Post.findById(post._id, "likes").exec()).likes;
    let founded = false;
    dbLikes.forEach((e) => {
      if (e == user._id) {
        founded = true;
      }
    });
    expect(founded).toBeTruthy();
  });

  it("without auth", async () => {
    const user = await createUser();
    const post = await createPost(user);
    await request(app)
      .post("/posts/" + post._id + "/likes/")
      .expect(401);
  });

  it("invalid post id", async () => {
    await request(app)
      .post("/posts/" + invalidId + "/likes/")
      .set("Authorization", "Bearer " + (await getToken()))
      .expect(404);
  });
});

describe("show likes GET /posts/postid/likes", () => {
  it("200 OK", async () => {
    const { user, token } = await createUserAndGetToken();
    const users = [await createUser(), await createUser(), await createUser()];
    const post = await createPost(user);
    await createLike(users[0], post);
    await createLike(users[1], post);
    await createLike(users[2], post);
    const res = await request(app)
      .get("/posts/" + post._id + "/likes/")
      .set("Authorization", "Bearer " + token)
      .expect(200);
    expectUsers(res.body, users);
  });

  it("no auth", async () => {
    const users = [await createUser(), await createUser(), await createUser()];
    const post = await createPost(users[0]);
    await createLike(users[0], post);
    await createLike(users[1], post);
    await createLike(users[2], post);
    await request(app)
      .get("/posts/" + post._id + "/likes/")
      .expect(401);
  });

  it("invalid post id", async () => {
    await request(app)
      .get("/posts/" + invalidId + "/likes/")
      .set("Authorization", "Bearer " + (await getToken()))
      .expect(404);
  });
});
