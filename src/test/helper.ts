import User, { IUser } from "../models/user";

function expectTimeStamp(resived, expected): void {
  if (expected.createdAt) {
    expect(new Date(resived.createdAt)).toEqual(expected.createdAt);
  }
  if (expected.updatedAt) {
    expect(new Date(resived.updatedAt)).toEqual(expected.updatedAt);
  }
}

export function expectUser(resived, expected): void {
  expect(resived._id).toBeDefined();
  expect(resived.name).toEqual(expected.name);
  expect(resived.email).toEqual(expected.email);
  if (expected.photoUrl) {
    expect(resived.photoUrl).toBeDefined();
  }
  if (expected.birthday) {
    expect(resived.birthday).toEqual(expected.birthday);
  }
  expectTimeStamp(resived, expected);
}

export function expectPost(resived, expected): void {
  expect(resived._id).toBeDefined();
  expectUser(resived.user, expected.user);
  expect(resived.type).toEqual(expected.type);
  expect(resived.data).toEqual(expected.data);
  expectTimeStamp(resived, expected);
  expect(resived.likes).toEqual(expected.likes);
}

let count = 0;

export async function creatUser(): Promise<IUser> {
  count++;
  return await User.create({
    name: "jone " + count,
    email: "jone@gmail.com" + count,
    photoUrl: "url.com/photo.jpg",
    birthday: "20-12-2020",
  });
}
