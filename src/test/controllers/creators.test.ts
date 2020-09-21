import {
  addLike,
  creatComment,
  createChat,
  createFriendRequest,
  createMessage,
  createPost,
  createUser,
  responseToFriendRequest,
} from "../../controllers/helper/creators";
import Post from "../../models/post";
import User from "../../models/user";
import Comment from "../../models/comment";
import {
  generateComment,
  generatePost,
  generateUser,
} from "../helper/generators";
import {
  clearDataBase,
  generateDbUser,
  generateDbPost,
} from "../helper/helper";
import { connect } from "../../dbConfigs/testing";
import Chat, {
  MessageBase,
  messageState,
  messageType,
} from "../../models/chat";
import { getChatById } from "../../controllers/helper/getters";

beforeAll(connect);

afterEach(clearDataBase);

describe("users", () => {
  it("create", async () => {
    const userData = generateUser();
    const userId = await createUser(userData);
    const dbUser = await User.findById(userId).exec();
    expect(dbUser).toBeDefined();
    expect(dbUser.email).toBe(userData.email);
  });

  it("create friend request", async () => {
    const user = await generateDbUser();
    const friend = await generateDbUser();
    await createFriendRequest(user._id, friend._id);

    const dbUser = await User.findById(user._id).exec();
    const dbFriend = await User.findById(friend._id).exec();
    expect(dbUser.sentFriendRequests.includes(friend._id)).toBeTruthy();
    expect(dbFriend.friendRequests.includes(user._id)).toBeTruthy();
  });

  it("response to a friend request accept", async () => {
    const user = await generateDbUser();
    const friend = await generateDbUser();
    await createFriendRequest(user._id, friend._id);
    await responseToFriendRequest(friend._id, user._id, "accept");

    const dbUser = await User.findById(user._id).exec();
    const dbFriend = await User.findById(friend._id).exec();
    expect(dbUser.sentFriendRequests.includes(friend._id)).toBeFalsy();
    expect(dbFriend.friendRequests.includes(user._id)).toBeFalsy();
    expect(dbUser.friends.includes(friend._id)).toBeTruthy();
    expect(dbFriend.friends.includes(user._id)).toBeTruthy();
  });

  it("response to a friend request reject", async () => {
    const user = await generateDbUser();
    const friend = await generateDbUser();
    await createFriendRequest(user._id, friend._id);
    await responseToFriendRequest(friend._id, user._id, "reject");

    const dbUser = await User.findById(user._id).exec();
    const dbFriend = await User.findById(friend._id).exec();
    expect(dbUser.sentFriendRequests.includes(friend._id)).toBeFalsy();
    expect(dbFriend.friendRequests.includes(user._id)).toBeFalsy();
    expect(dbUser.friends.includes(friend._id)).toBeFalsy();
    expect(dbFriend.friends.includes(user._id)).toBeFalsy();
  });
});

describe("posts", () => {
  it("create", async () => {
    const user = await generateDbUser();
    const postData = generatePost({ user: user._id });
    const postId = await createPost(postData);

    const dbPost = await Post.findById(postId);
    expect(dbPost).toBeDefined();
    expect(dbPost.user.toString()).toBe(user._id.toString());
  });
});

describe("comments", () => {
  it("create", async () => {
    const user = await generateDbUser();
    const post = await generateDbPost();
    const commentData = generateComment({ user: user._id, post: post._id });
    const commentId = await creatComment(commentData);

    const dbComment = await Comment.findById(commentId).exec();
    expect(dbComment).toBeDefined();
    expect(dbComment.user.toString()).toBe(user._id.toString());
    expect(dbComment.post.toString()).toBe(post._id.toString());
  });
});

describe("likes", () => {
  it("create", async () => {
    const user = await generateDbUser();
    const post = await generateDbPost();
    await addLike(post._id, user._id);

    const dbPost = await Post.findById(post._id).exec();
    expect(dbPost.likes.includes(user._id)).toBeTruthy();
  });
});

describe("chats", () => {
  it("create", async () => {
    const user = await generateDbUser();
    const friend = await generateDbUser();
    const chatId = await createChat(user._id, friend._id);

    const dbChat = await Chat.findById(chatId).exec();
    expect(dbChat.users.includes(user._id)).toBeTruthy();
    expect(dbChat.users.includes(friend._id)).toBeTruthy();
    expect(dbChat.users.length).toBe(2);
  });
});

describe("messages", () => {
  it("create", async () => {
    const user = await generateDbUser();
    const friend = await generateDbUser();
    const chatId = await createChat(user._id, friend._id);
    const chat = await getChatById(chatId);
    const massageData: MessageBase = {
      user: user._id,
      state: messageState.hold,
      text: "hi",
      type: messageType.text,
    };
    const message = await createMessage(chat._id, massageData);

    const dbMessage = await Chat.findById(chat._id).exec();
    expect(dbMessage.messages.slice(-1)[0]._id.toString()).toBe(
      message._id.toString()
    );
  });
});
