import {
  getFriendRequestsByUserId,
  getFriendsByUserId,
  getLikesByPostId,
  getPostById,
  getPostsByUserId,
  getSentFriendRequestsByUserId,
  getUserById,
  getCommentsByPostId,
  getCommentById,
} from "../../controllers/helper/getters";
import { connect } from "../../dbConfigs/testing";
import {
  expectCommentFormat,
  expectPostFormat,
  expectUserFormat,
} from "../helper/expect";
import {
  clearDataBase,
  generateDbComment,
  generateDbFriend,
  generateDbFriendRequest,
  generateDbLike,
  generateDbPost,
  generateDbUser,
} from "../helper/helper";

beforeAll(connect);

afterEach(clearDataBase);

describe("users", () => {
  it("get user by id", async () => {
    const user = await generateDbUser();

    const retUser = await getUserById(user._id);
    expectUserFormat(retUser);
  });

  it("get friends by userId", async () => {
    const user = await generateDbUser();
    const friends = [
      await generateDbFriend(user),
      await generateDbFriend(user),
      await generateDbFriend(user),
    ];

    const retUsers = await getFriendsByUserId(user._id);
    expect(retUsers.length).toBe(friends.length);
    for (let i = 0; i < friends.length; i++) {
      expectUserFormat(retUsers[i]);
      expect(retUsers[i]._id.toString()).toBe(friends[i]._id.toString());
    }
  });

  it("get sent friend requests by user id", async () => {
    const user = await generateDbUser();
    const users = [
      await generateDbUser(),
      await generateDbUser(),
      await generateDbUser(),
    ];
    await generateDbFriendRequest(users[0], user);
    await generateDbFriendRequest(users[1], user);
    await generateDbFriendRequest(users[2], user);
    const sentFriendRequests = await getSentFriendRequestsByUserId(user._id);
    expect(sentFriendRequests.length).toBe(users.length);
    for (let i = 0; i < sentFriendRequests.length; i++) {
      expectUserFormat(sentFriendRequests[i]);
      expect(sentFriendRequests[i]._id.toString()).toBe(
        users[i]._id.toString()
      );
    }
  });

  it("get friend requests by user id", async () => {
    const user = await generateDbUser();
    const users = [
      await generateDbFriendRequest(user),
      await generateDbFriendRequest(user),
      await generateDbFriendRequest(user),
    ];

    const friendRequests = await getFriendRequestsByUserId(user._id);
    expect(friendRequests.length).toBe(users.length);
    for (let i = 0; i < friendRequests.length; i++) {
      expectUserFormat(friendRequests[i]);
      expect(friendRequests[i]._id.toString()).toBe(users[i]._id.toString());
    }
  });
});

describe("post", () => {
  it("get posts by user id", async () => {
    const user = await generateDbUser();
    const posts = [
      await generateDbPost(user),
      await generateDbPost(user),
      await generateDbPost(user),
    ];
    const retPosts = await getPostsByUserId(user._id);
    expect(retPosts.length).toBe(posts.length);
    for (let i = 0; i < posts.length; i++) {
      expectPostFormat(retPosts[i]);
      expect(retPosts[i]._id.toString()).toBe(posts[i]._id.toString());
    }
  });

  it("get post by id", async () => {
    const user = await generateDbUser();
    const post = await generateDbPost(user._id);

    const retPost = await getPostById(post._id);
    expectPostFormat(retPost);
  });

  it("get likes by post id", async () => {
    const user = await generateDbUser();
    const users = [
      await generateDbUser(),
      await generateDbUser(),
      await generateDbUser(),
    ];
    const post = await generateDbPost(user);
    await generateDbLike(users[0], post);
    await generateDbLike(users[1], post);
    await generateDbLike(users[2], post);

    const retLikes = await getLikesByPostId(post._id);
    expect(retLikes.length).toBe(users.length);
    for (let i = 0; i < users.length; i++) {
      expectUserFormat(retLikes[i]);
      expect(retLikes[i]._id.toString()).toBe(users[i]._id.toString());
    }
  });

  it("get comments by post id", async () => {
    const user = await generateDbUser();
    const post = await generateDbPost(user);
    const comments = [
      await generateDbComment(user, post),
      await generateDbComment(user, post),
      await generateDbComment(user, post),
    ];

    const retComments = await getCommentsByPostId(post._id);
    expect(retComments.length).toBe(comments.length);
    for (let i = 0; i < retComments.length; i++) {
      expectCommentFormat(retComments[i]);
      expect(retComments[i]._id.toString()).toBe(comments[i]._id.toString());
    }
  });

  it("get comment by id", async () => {
    const user = await generateDbUser();
    const post = await generateDbPost(user);
    const comment = await generateDbComment(user, post);

    const retComment = await getCommentById(comment._id);
    expectCommentFormat(retComment);
  });
});
