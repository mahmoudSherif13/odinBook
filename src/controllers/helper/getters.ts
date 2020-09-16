import User, { IUser, UserBase } from "../../models/user";
import Post, { IPost, PostBase } from "../../models/post";
import Comment, { IComment } from "../../models/comment";
import {
  USER_SELECTOR,
  COMMENT_SELECTOR,
  POST_SELECTOR,
  CHAT_SELECTOR,
} from "./selectors";
import Chat, { IChat } from "../../models/chat";

// user
export async function getUserDataByUserId(userId: string): Promise<IUser> {
  return await User.findById(userId, USER_SELECTOR);
}

// friends
export async function getFriendsByUserId(
  userId: string
): Promise<IUser[] | string[]> {
  return (
    await User.findById(userId, "friends")
      .populate("friends", USER_SELECTOR)
      .exec()
  ).friends;
}

export async function getSentFriendRequestsByUserId(
  userId: string
): Promise<IUser[] | string[]> {
  return (
    await User.findById(userId, "sentFriendRequests")
      .populate("sentFriendRequests", USER_SELECTOR)
      .exec()
  ).sentFriendRequests;
}

export async function getFriendRequestsByUserId(
  userId: string
): Promise<IUser[] | string[]> {
  return (
    await User.findById(userId, "friendRequests")
      .populate("friendRequests", USER_SELECTOR)
      .exec()
  ).friendRequests;
}

// posts
export async function getPostsByUserId(userId: string): Promise<IPost[]> {
  return await Post.find({ user: userId }, POST_SELECTOR)
    .populate("user", USER_SELECTOR)
    .sort({
      createdAt: 1,
    })
    .exec();
}

export async function getPostById(postId: string) {
  const post = await Post.findById(postId, POST_SELECTOR)
    .populate("user", USER_SELECTOR)
    .exec();
  return { ...post.toJSON(), likes: post.likes.length };
}

export async function getPostAndLikesListById(postId: string): Promise<IPost> {
  const post = await Post.findById(postId, POST_SELECTOR)
    .populate("user", USER_SELECTOR)
    .populate("likes", USER_SELECTOR)
    .exec();
  return post;
}

export async function getLikesByPostId(
  postId: string
): Promise<IUser[] | string[]> {
  return await (
    await Post.findById(postId).populate("likes", USER_SELECTOR).exec()
  ).likes;
}

export async function getCommentsByPostId(postId: string): Promise<IComment[]> {
  const comment = await Comment.find({ post: postId }, COMMENT_SELECTOR)
    .populate("user", USER_SELECTOR)
    .exec();
  return comment;
}

export async function getCommentById(commentId: string): Promise<IComment> {
  return await Comment.findById(commentId, COMMENT_SELECTOR)
    .populate("user", USER_SELECTOR)
    .exec();
}

export async function getFeedPostsByUserId(userId: string): Promise<IPost[]> {
  const feedUsers: any = await getFriendsByUserId(userId);
  feedUsers.push(userId);
  const postList = await Post.find({ user: { $in: feedUsers } })
    .populate("user", USER_SELECTOR)
    .sort({
      createdAt: 1,
    })
    .exec();
  return postList;
}

// chats
export async function getChatsByUserId(userId: string) {
  const chats = await Chat.find({ users: userId }, CHAT_SELECTOR).slice(
    "messages",
    -1
  );
  const chatsArr = [];
  chats.forEach((chat) => {
    chatsArr.push({
      _id: chat._id,
      users: chat.users,
      lastMessage: chat.messages[0],
    });
  });
  return chatsArr;
}

export async function getChatById(chatId: string): Promise<IChat> {
  return await Chat.findById(chatId, CHAT_SELECTOR);
}
