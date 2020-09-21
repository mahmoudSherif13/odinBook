import { PostBase } from "src/models/post";
import { UserBase } from "src/models/user";

type UserBaseWithId = UserBase & { _id?: string };
type PostBaseWithId = PostBase & { _id?: string };

export function expectUserFormat(received: UserBaseWithId): void {
  expect(received._id).toBeDefined();
  expect(received.firstName).toBeDefined();
  expect(received.lastName).toBeDefined();
  expect(received.email).toBeDefined();
}
export function expectPostFormat(received: PostBaseWithId): void {
  expect(received._id).toBeDefined();
  expect(received.type).toBeDefined();
  expect(received.text).toBeDefined();
  expect(received.user).toBeDefined();
  expectUserFormat(received.user);
}
export function expectCommentFormat(received): void {
  expect(received._id).toBeDefined();
  expect(received.type).toBeDefined();
}

export function expectUser(received: UserBaseWithId, expected: UserBase): void {
  expectUserFormat(received);
  expect(received.email).toEqual(expected.email);
}

export function expectPost(
  received: PostBaseWithId,
  expected: PostBaseWithId
): void {
  expectPostFormat(received);
  expect(received._id.toString()).toEqual(expected._id.toString());
}

export function expectComment(received, expected): void {
  expectCommentFormat(received);
  expect(received.user._id.toString()).toEqual(expected.user._id.toString());
  expect(received.post.toString()).toEqual(expected.post.toString());
  expect(received.type).toEqual(expected.type);
  expect(received.text).toEqual(expected.text);
}

export function expectUsers(received, expected): void {
  for (let i = 0; i < expected.length; i++) {
    expectUser(received[i], expected[i]);
  }
}

export function expectPosts(
  received: PostBaseWithId[],
  expected: PostBaseWithId[]
): void {
  for (let i = 0; i < expected.length; i++) {
    expectPost(received[i], expected[i]);
  }
}

export function expectComments(received, expected): void {
  for (let i = 0; i < expected.length; i++) {
    expectComment(received[i], expected[i]);
  }
}
