import {
  createPost,
  createUserAndGetToken,
  getToken,
  clearDataBase,
  createUser,
  createComment,
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
    const { user, token } = await createUserAndGetToken();
    const commentData = generateComment();
    const post = await createPost(user);
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
    const post = await createPost();
    await request(app)
      .post("/posts/" + post._id + "/comments/")
      .send(commentData)
      .expect(401);
  });

  it("invalid type", async () => {
    const { user, token } = await createUserAndGetToken();
    const commentData = generateComment({ type: "invalid type" });
    const post = await createPost(user);
    await request(app)
      .post("/posts/" + post._id + "/comments/")
      .send(commentData)
      .set("Authorization", "Bearer " + token)
      .expect(400);
  });

  it("empty text", async () => {
    const { user, token } = await createUserAndGetToken();
    const commentData = generateComment({ text: "" });
    const post = await createPost(user);
    await request(app)
      .post("/posts/" + post._id + "/comments/")
      .send(commentData)
      .set("Authorization", "Bearer " + token)
      .expect(400);
  });

  it("empty text", async () => {
    const { user, token } = await createUserAndGetToken();
    const commentData = generateComment({ text: "" });
    const post = await createPost(user);
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
    const { user, token } = await createUserAndGetToken();
    const users = [await createUser(), await createUser(), await createUser()];
    const post = await createPost(user);
    const comments = [
      await createComment(users[0], post),
      await createComment(users[1], post),
      await createComment(users[2], post),
    ];
    const res = await request(app)
      .get("/posts/" + post._id + "/comments/")
      .set("Authorization", "Bearer " + token)
      .expect(200);
    expectComments(res.body, comments);
  });

  it("no auth", async () => {
    const users = [await createUser(), await createUser(), await createUser()];
    const post = await createPost(users[0]);
    await createComment(users[0], post);
    await createComment(users[1], post);
    await createComment(users[2], post);
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
