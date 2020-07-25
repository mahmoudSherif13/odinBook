import request from "supertest";
import app from "../app";
import User from "../models/user";
import { userNotFounded } from "../errorCodes";
import {
  users,
  totalInvalidUser,
  updatedUser,
  idvalidId as invalidId,
} from "./testdata";
import { expectUser } from "./helper";
import "../mongoConfigTesting";

let addedUsers = [];

async function clearUserData() {
  await User.deleteMany({});
  addedUsers = [];
}

describe("GET /users/", () => {
  it("auth", async () => {
    const user = (await request(app).post("/users/").send(users[0]).expect(200))
      .body;
    addedUsers.push(user);
    const loginRes = await request(app).post("/login").send({
      email: users[0].email,
      password: users[0].password,
    });
    const res = await request(app)
      .get("/users")
      .set("Authorization", "Bearer " + loginRes.body.token)
      .expect(200);
    expectUser(res.body[0], addedUsers[0]);
  });

  it("not auth", async () => {
    const user = (await request(app).post("/users/").send(users[0]).expect(200))
      .body;
    addedUsers.push(user);

    await request(app).get("/users").expect(401);
  });

  afterEach(clearUserData);
  afterAll(clearUserData);
});

describe("POST /users/", () => {
  it("create new user", async () => {
    const res = await request(app).post("/users").send(users[0]).expect(200);

    expectUser(res.body, users[0]);
  });

  it("create the same user", async () => {
    await request(app).post("/users").send(users[0]).expect(500);
  });

  it("creat invalid email", async () => {
    await request(app)
      .post("/users")
      .send(totalInvalidUser)
      .expect(422)
      .expect({
        errors: [
          {
            email: "Invalid value",
          },
          {
            photoUrl: "Invalid value",
          },
        ],
      });
  });

  afterAll(clearUserData);
});

describe("get /users/:id", () => {
  it("auth", async () => {
    const user = (await request(app).post("/users/").send(users[0])).body;

    const loginRes = await request(app).post("/login/").send({
      email: users[0].email,
      password: users[0].password,
    });

    const res = await request(app)
      .get("/users/" + user._id)
      .set("Authorization", "Bearer " + loginRes.body.token)
      .expect(200);
    expectUser(res.body, user);
  });

  it("not auth", async () => {
    const user = (await request(app).post("/users/").send(users[0])).body;

    const res = await request(app)
      .get("/users/" + user._id)
      .expect(401);
  });

  it("invalid id", async () => {
    const user = (await request(app).post("/users/").send(users[0])).body;

    const loginRes = await request(app).post("/login/").send({
      email: users[0].email,
      password: users[0].password,
    });

    await request(app)
      .get("/users/" + invalidId)
      .set("Authorization", "Bearer " + loginRes.body.token)
      .expect(404);
  });
  afterAll(clearUserData);
});

describe("delete /users/", () => {
  it("auth", async () => {
    const user = (await request(app).post("/users/").send(users[0])).body;

    const loginRes = await request(app).post("/login/").send({
      email: users[0].email,
      password: users[0].password,
    });

    await request(app).post("/users/").send(users[1]);
    const loginRes2 = await request(app).post("/login/").send({
      email: users[1].email,
      password: users[1].password,
    });

    const deleteRes = await request(app)
      .delete("/users/" + user._id)
      .set("Authorization", "Bearer " + loginRes.body.token)
      .expect(200);

    expectUser(deleteRes.body, user);

    await request(app)
      .get("/users/" + user._id)
      .set("Authorization", "Bearer " + loginRes2.body.token)
      .expect(404)
      .expect(userNotFounded);
  });

  it("invalid id", async () => {
    await request(app).post("/users/").send(users[1]);
    const loginRes = await request(app).post("/login/").send({
      email: users[1].email,
      password: users[1].password,
    });

    await request(app)
      .delete("/users/" + invalidId)
      .set("Authorization", loginRes.body.token)
      .expect(404)
      .expect(userNotFounded);
  });

  it("not auth", async () => {
    const user = (await request(app).post("/users/").send(users[0])).body;

    const deleteRes = await request(app)
      .delete("/users/" + user._id)
      .expect(401);

    await request(app)
      .get("/users/" + user._id)
      .expect(401)
      .expect(userNotFounded);
  });

  afterAll(clearUserData);
});

describe("update /users/", () => {
  beforeAll(async () => {
    const user = await User.create(users[0]);
    addedUsers.push(user);
  });

  it("update user", async () => {
    const res = await request(app)
      .put("/users/" + addedUsers[0]._id)
      .send(updatedUser)
      .expect(200);

    expectUser(res.body, addedUsers[0]);

    const newUserRes = await request(app).get(addedUsers[0].url).expect(200);

    expectUser(newUserRes.body, updatedUser);
  });
});
