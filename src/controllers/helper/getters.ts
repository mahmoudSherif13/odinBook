import User, { IUser, UserBaseWithId } from "../../models/user";
import Post, { PostBaseWithId } from "../../models/post";
import Comment, { CommentBaseWithId } from "../../models/comment";
import {
  USER_SELECTOR,
  COMMENT_SELECTOR,
  POST_SELECTOR,
  CHAT_SELECTOR,
} from "./selectors";
import Chat, { IChat } from "../../models/chat";

// user
export async function getUserById(userId: string): Promise<UserBaseWithId> {
  return await User.findById(userId, USER_SELECTOR);
}

// friends
export async function getFriendsByUserId(
  userId: string
): Promise<UserBaseWithId[] | IUser["_id"][]> {
  return (
    await User.findById(userId, "friends")
      .populate("friends", USER_SELECTOR)
      .exec()
  ).friends;
}

export async function getSentFriendRequestsByUserId(
  userId: string
): Promise<UserBaseWithId[] | IUser["_id"][]> {
  return (
    await User.findById(userId, "sentFriendRequests")
      .populate("sentFriendRequests", USER_SELECTOR)
      .exec()
  ).sentFriendRequests;
}

export async function getFriendRequestsByUserId(
  userId: string
): Promise<UserBaseWithId[] | IUser["_id"][]> {
  return (
    await User.findById(userId, "friendRequests")
      .populate("friendRequests", USER_SELECTOR)
      .exec()
  ).friendRequests;
}

// posts
export async function getPostsByUserId(
  userId: string
): Promise<PostBaseWithId[]> {
  return await Post.find({ user: userId }, POST_SELECTOR)
    .populate("user", USER_SELECTOR)
    .sort({
      createdAt: 1,
    })
    .exec();
}

export async function getPostById(postId: string): Promise<PostBaseWithId> {
  return (
    await Post.findById(postId, POST_SELECTOR)
      .populate("user", USER_SELECTOR)
      .populate("likes", USER_SELECTOR)
      .exec()
  ).toJSON();
}

export async function getLikesByPostId(
  postId: string
): Promise<UserBaseWithId[]> {
  return await (
    await Post.findById(postId).populate("likes", USER_SELECTOR).exec()
  ).likes;
}

export async function getCommentsByPostId(
  postId: string
): Promise<CommentBaseWithId[]> {
  const comment = await Comment.find({ post: postId }, COMMENT_SELECTOR)
    .populate("user", USER_SELECTOR)
    .exec();
  return comment;
}

export async function getCommentById(
  commentId: string
): Promise<CommentBaseWithId> {
  return await Comment.findById(commentId, COMMENT_SELECTOR)
    .populate("user", USER_SELECTOR)
    .exec();
}

export async function getFeedPostsByUserId(
  userId: string
): Promise<PostBaseWithId[]> {
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

export async function checkIfChatCreated(
  userId: string,
  friendId: string
): Promise<boolean> {
  const dbChat = await Chat.findOne({
    users: { $all: [userId, friendId] },
  });
  if (dbChat) {
    return true;
  }
  return false;
}

export async function getChatById(chatId: string): Promise<IChat> {
  return await Chat.findById(chatId, CHAT_SELECTOR);
}
