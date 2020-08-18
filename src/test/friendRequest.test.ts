import request from "supertest";
import app from "../app";
import User from "../models/user";
import Post from "../models/post";
import { expectPost, getLoginData, createPost, generateUser } from "./helper";
import { connect } from "../dbConfigs/testing";
import { invalidId, postData } from "./testData";

beforeAll(connect);

afterEach(async () => {
  await Post.deleteMany({});
  await User.deleteMany({});
});

describe("create", () => {
  it("create a friend request", async () => {
    const user1 = await generateUser();
    const user2 = await generateUser();
    const token = (await getLoginData()).token;
    await request(app)
      .post(`/users/${user1._id}/friendRequests`)
      .send({ user: user2._id })
      .set("Authorization", "Bearer " + token)
      .expect(200);
    const dbUser2 = await User.findById(user2._id, "friendRequests").exec();
    let founded = false;
    console.log(dbUser2);
    dbUser2.friendRequests.forEach((req) => {
      if (req._id == user1._id) {
        founded = true;
      }
    });
    expect(founded).toEqual(true);
  });

  it("reCreate the same friend request", async () => {
    const user1 = await generateUser();
    const user2 = await generateUser();
    const token = (await getLoginData()).token;
    await request(app)
      .post(`/users/${user1._id}/friendRequests`)
      .send({ user: user2._id })
      .set("Authorization", "Bearer " + token)
      .expect(200);
    await request(app)
      .post(`/users/${user1._id}/friendRequests`)
      .send({ user: user2._id })
      .set("Authorization", "Bearer " + token)
      .expect(200);
    const dbUser2 = await User.findById(user2._id, "friendRequests").exec();
    let foundedCount = 0;
    dbUser2.friendRequests.forEach((req) => {
      if (req._id == user1._id) {
        foundedCount++;
      }
    });
    expect(foundedCount).toEqual(1);
  });
});

describe("list friendRequests", () => {
  it("list", async () => {
    const user = await generateUser();
    const user1 = await generateUser();
    const user2 = await generateUser();
    const token = (await getLoginData()).token;
    await request(app)
      .post(`/users/${user._id}/friendRequests`)
      .send({ user: user1._id })
      .set("Authorization", "Bearer " + token)
      .expect(200);
    await request(app)
      .post(`/users/${user._id}/friendRequests`)
      .send({ user: user2._id })
      .set("Authorization", "Bearer " + token)
      .expect(200);
    const requestsList = (
      await request(app)
        .get(`/users/${user._id}/friendRequests`)
        .set("Authorization", "Bearer " + token)
        .expect(200)
    ).body;
    let user1Founded = false;
    let user2Founded = false;
    requestsList.forEach((req) => {
      if (req._id == user1._id) {
        user1Founded = true;
      }
      if (req._id == user2._id) {
        user2Founded = true;
      }
      expect(user1Founded).toEqual(true);
      expect(user2Founded).toEqual(true);
      expect(requestsList).toHaveLength(2);
    });
  });
});
