export function expectUserFormat(received) {
  expect(received._id).toBeDefined();
  expect(received.name).toBeDefined();
  expect(received.email).toBeDefined();
}
export function expectPostFormat(received): void {
  expect(received._id).toBeDefined();
  expect(received.type).toBeDefined();
  expect(received.likes).toBeDefined();
}
export function expectCommentFormat(received): void {
  expect(received._id).toBeDefined();
  expect(received.type).toBeDefined();
}

export function expectUser(received, expected): void {
  expectUserFormat(received);
  expect(received.name).toEqual(expected.name);
  expect(received.email).toEqual(expected.email);
  if (expected.photoUrl) {
    expect(received.photoUrl).toBeDefined();
  }
  if (expected.birthday) {
    expect(received.birthday).toEqual(expected.birthday);
  }
}

export function expectPost(received, expected): void {
  expectPostFormat(received);
  expect(received.user._id.toString()).toEqual(expected.user._id.toString());
  expect(received.type).toEqual(expected.type);
  expect(received.text).toEqual(expected.text);
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

export function expectPosts(received, expected): void {
  for (let i = 0; i < expected.length; i++) {
    expectPost(received[i], expected[i]);
  }
}

export function expectComments(received, expected): void {
  for (let i = 0; i < expected.length; i++) {
    expectComment(received[i], expected[i]);
  }
}
