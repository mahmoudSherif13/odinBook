export function expectUser(reserved, expected): void {
  expect(reserved._id).toBeDefined();
  expect(reserved.name).toEqual(expected.name);
  expect(reserved.email).toEqual(expected.email);
  if (expected.photoUrl) {
    expect(reserved.photoUrl).toBeDefined();
  }
  if (expected.birthday) {
    expect(reserved.birthday).toEqual(expected.birthday);
  }
}

export function expectPost(reserved, expected): void {
  expect(reserved._id).toBeDefined();
  expect(reserved.user.name).toEqual(expected.user.name);
  expect(reserved.user.email).toEqual(expected.user.email);
  if (expected.user.photoUrl) {
    expect(reserved.user.photoUrl).toEqual(expected.user.photoUrl);
  }
  expect(reserved.type).toEqual(expected.type);
  expect(reserved.data).toEqual(expected.data);
  if (expected.likes) {
    expect(reserved.likes).toEqual(expected.likes);
  }
}
