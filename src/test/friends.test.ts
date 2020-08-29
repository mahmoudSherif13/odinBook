import request from "supertest";
import app from "../app";
import User from "../models/user";
import {
  createUserAndGetToken,
  createUser,
  createFriend,
  expectUsers,
  createFriendRequest,
  clearDataBase,
  getToken,
} from "./helper";
import { connect } from "../dbConfigs/testing";
import { invalidId } from "./testData";

beforeAll(connect);

afterEach(clearDataBase);

describe("show friends list GET /friends", () => {
  it("200 OK", async () => {
    const { user, token } = await createUserAndGetToken();
    const friends = [
      await createFriend(user),
      await createFriend(user),
      await createFriend(user),
    ];
    const res = await request(app)
      .get("/friends/")
      .set("Authorization", "Bearer " + token)
      .expect(200);
    expectUsers(res.body, friends);
  });

  it("not auth GET /friends", async () => {
    await request(app).get("/friends/").expect(401);
  });
});

describe("list friendRequests GET /friends/requests", () => {
  it("200 OK", async () => {
    const { user, token } = await createUserAndGetToken();
    const friendRequests = [
      await createFriendRequest(user),
      await createFriendRequest(user),
      await createFriendRequest(user),
    ];
    const res = await request(app)
      .get("/friends/requests")
      .set("Authorization", "Bearer " + token)
      .expect(200);
    expectUsers(res.body, friendRequests);
  });
  it("not auth", async () => {
    await request(app).get("/friends/requests").expect(401);
  });
});

describe("list sent friendRequests GET /friends/requests/sent", () => {
  it("200 OK", async () => {
    const { user, token } = await createUserAndGetToken();
    const users = [await createUser(), await createUser(), await createUser()];
    await createFriendRequest(users[0], user);
    await createFriendRequest(users[1], user);
    await createFriendRequest(users[2], user);
    const res = await request(app)
      .get("/friends/requests/sent")
      .set("Authorization", "Bearer " + token)
      .expect(200);
    expectUsers(res.body, users);
  });
  it("not auth", async () => {
    await request(app).get("/friends/requests/sent").expect(401);
  });
});

describe("creat a new friend request POST /friends/request", () => {
  it("200 OK", async () => {
    const { user, token } = await createUserAndGetToken();
    const friend = await createUser();
    await request(app)
      .post("/friends/requests")
      .send({ userId: friend._id })
      .set("Authorization", "Bearer " + token)
      .expect(200);
    const dbUser = await User.findById(user._id, "sentFriendRequests");
    let founded = false;
    dbUser.sentFriendRequests.forEach((e) => {
      if (e.toString() === friend._id.toString()) {
        founded = true;
      }
    });
    expect(founded).toBeTruthy();

    const dbFriend = await User.findById(friend._id, "friendRequests");
    founded = false;
    dbFriend.friendRequests.forEach((e) => {
      if (e.toString() === user._id.toString()) {
        founded = true;
      }
    });
    expect(founded).toBeTruthy();
  });

  it("on auth", async () => {
    const friend = await createUser();
    await request(app)
      .post("/friends/requests")
      .send({ userId: friend._id })
      .expect(401);
  });

  it("invalid user id ", async () => {
    await request(app)
      .post("/friends/requests")
      .send({ userId: invalidId })
      .set("Authorization", "Bearer " + (await getToken()))
      .expect(400);
  });

  it("invalid user id ", async () => {
    await request(app)
      .post("/friends/requests")
      .set("Authorization", "Bearer " + (await getToken()))
      .expect(400);
  });
});

describe("response to a friend request PUT /friends/requests/requestId", () => {
  it("accept the request", async () => {
    const { user, token } = await createUserAndGetToken();
    const friend = await createUser();
    await createFriendRequest(user, friend);
    await request(app)
      .put("/friends/requests/" + friend._id)
      .send({ response: "accept" })
      .set("Authorization", "Bearer " + token)
      .expect(200);

    const dbUser = await User.findById(user._id);
    const dbFriend = await User.findById(friend._id);
    let founded = false;
    dbUser.sentFriendRequests.forEach((e) => {
      if (e.toString() === friend._id.toString()) {
        founded = true;
      }
    });
    expect(founded).toBeFalsy();
    founded = false;

    dbUser.friends.forEach((e) => {
      if (e.toString() === friend._id.toString()) {
        founded = true;
      }
    });
    expect(founded).toBeTruthy();

    founded = false;
    dbFriend.friendRequests.forEach((e) => {
      if (e.toString() === user._id.toString()) {
        founded = true;
      }
    });
    expect(founded).toBeFalsy();
    founded = false;
    dbFriend.friends.forEach((e) => {
      if (e.toString() === user._id.toString()) {
        founded = true;
      }
    });
    expect(founded).toBeTruthy();
  });

  it("no auth", async () => {
    const { user, token } = await createUserAndGetToken();
    const friend = await createUser();
    await createFriendRequest(user, friend);
    await request(app)
      .put("/friends/requests/" + friend._id)
      .send({ response: "accept" })
      .expect(401);
  });

  it("wrong userId", async () => {
    const { user, token } = await createUserAndGetToken();
    const friend = await createUser();
    await createFriendRequest(user, friend);
    await request(app)
      .put("/friends/requests/" + invalidId)
      .send({ response: "accept" })
      .set("Authorization", "Bearer " + token)
      .expect(404);
  });
});
