import request from "supertest";
import app from "../app";
import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";
import { expectPost, getLoginData, createPost } from "./helper";
import * as POST_ERRORS from "../errorCodes";
import { connect } from "../dbConfigs/testing";
import { invalidId, postData, commentData } from "./testData";

beforeAll(connect);

afterEach(async () => {
  await Post.deleteMany({});
  await User.deleteMany({});
});

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

describe("likes", () => {
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

describe("comments", () => {
  it("create comment", async () => {
    const { user, token } = await getLoginData();
    const post = await createPost(
      {
        ...postData,
        user: user._id,
      },
      token
    );
    const comment = {
      ...commentData,
      user: user._id,
      post: post._id,
    };
    const commentRes = await request(app)
      .post("/comments/")
      .send(comment)
      .set("Authorization", "Bearer " + token)
      .expect(200);
    const dbComments = await Comment.find({ post: post._id }, "_id").exec();
    let founded = false;
    dbComments.forEach((c) => {
      if (c._id == commentRes.body._id) {
        founded = true;
      }
    });
    expect(founded).toEqual(true);
  });

  it("create comment without post id", async () => {
    const { user, token } = await getLoginData();
    const post = await createPost(
      {
        ...postData,
        user: user._id,
      },
      token
    );
    const comment = {
      ...commentData,
      user: user._id,
    };
    const commentRes = await request(app)
      .post("/comments/")
      .send(comment)
      .set("Authorization", "Bearer " + token)
      .expect(400);
    const dbComments = await Comment.find({ post: post._id }, "_id").exec();
    let founded = false;
    dbComments.forEach((c) => {
      if (c._id == commentRes.body._id) {
        founded = true;
      }
    });
    expect(founded).toEqual(false);
  });

  it("create comment without user id", async () => {
    const { user, token } = await getLoginData();
    const post = await createPost(
      {
        ...postData,
        user: user._id,
      },
      token
    );
    const comment = {
      ...commentData,
      post: post._id,
    };
    const commentRes = await request(app)
      .post("/comments/")
      .send(comment)
      .set("Authorization", "Bearer " + token)
      .expect(400);
    const dbComments = await Comment.find({ post: post._id }, "_id").exec();
    let founded = false;
    dbComments.forEach((c) => {
      if (c._id == commentRes.body._id) {
        founded = true;
      }
    });
    expect(founded).toEqual(false);
  });

  it("create comment without auth", async () => {
    const { user, token } = await getLoginData();
    const post = await createPost(
      {
        ...postData,
        user: user._id,
      },
      token
    );
    const comment = {
      ...commentData,
      post: post._id,
      user: user._id,
    };
    const commentRes = await request(app)
      .post("/comments/")
      .send(comment)
      .expect(401);
    const dbComments = await Comment.find({ post: post._id }, "_id").exec();
    let founded = false;
    dbComments.forEach((c) => {
      if (c._id == commentRes.body._id) {
        founded = true;
      }
    });
    expect(founded).toEqual(false);
  });
});

// describe("get all post comments", () => {
//   it("get post comments", async () => {});
// });
