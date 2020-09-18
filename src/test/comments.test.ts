import {
  generateDbPost,
  generateDbUserAndGetToken,
  getToken,
  clearDataBase,
  generateDbUser,
  generateDbComment,
} from "./helper/helper";
import { expectComments, expectComment } from "./helper/expect";
import { generateComment } from "./helper/generators";
import request from "supertest";
import app from "../app";
import { invalidId } from "./helper/testData";
import { connect } from "../dbConfigs/testing";
import Comment from "../models/comment";

beforeAll(connect);

afterEach(clearDataBase);

describe("create comment POST /posts/postId/comments", () => {
  it("create comment", async () => {
    const { user, token } = await generateDbUserAndGetToken();
    const commentData = generateComment();
    const post = await generateDbPost(user);
    const res = await request(app)
      .post("/posts/" + post._id + "/comments/")
      .send(commentData)
      .set("Authorization", "Bearer " + token)
      .expect(200);
    const dbComment = await Comment.findById(res.body._id)
      .populate("user", "_id name email photoUrl birthday")
      .exec();
    expectComment(res.body, {
      ...commentData,
      user,
      post: post._id,
    });

    expectComment(dbComment, {
      ...commentData,
      user,
      post: post._id,
    });
  });

  it("without auth", async () => {
    const commentData = generateComment();
    const post = await generateDbPost();
    await request(app)
      .post("/posts/" + post._id + "/comments/")
      .send(commentData)
      .expect(401);
  });

  it("invalid type", async () => {
    const { user, token } = await generateDbUserAndGetToken();
    const commentData = generateComment({ type: "invalid type" });
    const post = await generateDbPost(user);
    await request(app)
      .post("/posts/" + post._id + "/comments/")
      .send(commentData)
      .set("Authorization", "Bearer " + token)
      .expect(400);
  });

  it("empty text", async () => {
    const { user, token } = await generateDbUserAndGetToken();
    const commentData = generateComment({ text: "" });
    const post = await generateDbPost(user);
    await request(app)
      .post("/posts/" + post._id + "/comments/")
      .send(commentData)
      .set("Authorization", "Bearer " + token)
      .expect(400);
  });

  it("empty text", async () => {
    const { user, token } = await generateDbUserAndGetToken();
    const commentData = generateComment({ text: "" });
    const post = await generateDbPost(user);
    await request(app)
      .post("/posts/" + post._id + "/comments/")
      .send(commentData)
      .set("Authorization", "Bearer " + token)
      .expect(400);
  });

  it("invalid post id", async () => {
    const commentData = generateComment();
    await request(app)
      .post("/posts/" + invalidId + "/comments/")
      .send(commentData)
      .set("Authorization", "Bearer " + (await getToken()))
      .expect(404);
  });
});

describe("show comments GET /posts/postid/comments", () => {
  it("200 OK", async () => {
    const { user, token } = await generateDbUserAndGetToken();
    const users = [
      await generateDbUser(),
      await generateDbUser(),
      await generateDbUser(),
    ];
    const post = await generateDbPost(user);
    const comments = [
      await generateDbComment(users[0], post),
      await generateDbComment(users[1], post),
      await generateDbComment(users[2], post),
    ];
    const res = await request(app)
      .get("/posts/" + post._id + "/comments/")
      .set("Authorization", "Bearer " + token)
      .expect(200);
    expectComments(res.body, comments);
  });

  it("no auth", async () => {
    const users = [
      await generateDbUser(),
      await generateDbUser(),
      await generateDbUser(),
    ];
    const post = await generateDbPost(users[0]);
    await generateDbComment(users[0], post);
    await generateDbComment(users[1], post);
    await generateDbComment(users[2], post);
    await request(app)
      .get("/posts/" + post._id + "/comments/")
      .expect(401);
  });

  it("invalid post id", async () => {
    await request(app)
      .get("/posts/" + invalidId + "/comments/")
      .set("Authorization", "Bearer " + (await getToken()))
      .expect(404);
  });
});
