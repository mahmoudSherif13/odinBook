import request from "supertest";
import app from "../app";
import User from "../models/user";
import { userNotFounded } from "../errorCodes";
require("../mongoConfigTesting");

const users = [
  {
    name: "jone",
    email: "jone@gmail.com",
    photoUrl: "url.com/photo.jpg",
    birthday: "20-12-2020",
  },
  {
    name: "jojo",
    email: "jojo@jojo_cop.com",
  },
  {
    name: "reka",
    email: "reka@anne.com",
  },
];

const updatedUser = {
  name: "jone",
  email: "jone@gmail.com",
  photoUrl: "url.com/photo.jpg",
  birthday: "20-12-2020",
};

const totalInvalidUser = {
  name: "jone",
  email: "jonegmail.com",
  photoUrl: "urlphoto",
};

let addedUsers = [];

const idvalidId = "444444444444444444444444";

async function clearUserData() {
  await User.deleteMany({});
  addedUsers = [];
}

function expectUser(resived, expected) {
  expect(resived._id).toBeDefined();
  expect(resived.name).toEqual(expected.name);
  expect(resived.email).toEqual(expected.email);
  if (expected.photoUrl) {
    expect(resived.photoUrl).toBeDefined();
  }
  if (expected.birthday) {
    expect(resived.birthday).toEqual(expected.birthday);
  }
  if (expected.createdAt) {
    expect(new Date(resived.createdAt)).toEqual(expected.createdAt);
  }
  if (expected.updatedAt) {
    expect(new Date(resived.updatedAt)).toEqual(expected.updatedAt);
  }
}

describe("GET /users/", () => {
  it("get one user", async () => {
    const user = await User.create(users[0]);
    addedUsers.push(user);
    const res = await request(app).get("/users").expect(200);
    expectUser(res.body[0], addedUsers[0]);
  });

  it("get all users", async () => {
    for (let i = 0; i < users.length; i++) {
      const user = await User.create(users[i]);
      addedUsers.push(user);
    }
    const res = await request(app).get("/users").expect(200);

    for (let i = 0; i < users.length; i++) {
      expectUser(res.body[i], addedUsers[i]);
    }
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

  it("creat invaild email", async () => {
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

describe("get /users/id", () => {
  it("get user", async () => {
    const user = await User.create(users[0]);
    addedUsers.push(user);
    const res = await request(app)
      .get("/users/" + addedUsers[0]._id)
      .expect(200);
    expectUser(res.body, addedUsers[0]);
  });

  it("invalid id", async () => {
    await request(app)
      .get("/users/" + idvalidId)
      .expect(404);
  });
  afterAll(clearUserData);
});

describe("delete /users/", () => {
  it("delete user", async () => {
    const user = await User.create(users[0]);
    const deleteRes = await request(app)
      .delete("/users/" + user._id)
      .expect(200);
    expectUser(deleteRes.body, user);
    await request(app)
      .get("/users/" + user._id)
      .expect(404)
      .expect(userNotFounded);
  });

  it("delete invalid user", async () => {
    await request(app)
      .delete("/users/" + idvalidId)
      .expect(404)
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
