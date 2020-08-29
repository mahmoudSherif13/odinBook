import User, { IUser } from "../../models/user";
import Post, { IPost } from "../../models/post";
import Comment, { IComment } from "../../models/comment";

export const USER_DATA_SELECTOR = "_id name email photoUrl birthday";
export const POST_DATA_SELECTOR = "_id type text user likes";
export const COMMENT_DATA_SELECTOR = "_id type text user post";

export async function getUserDataByUserId(userId: string): Promise<IUser> {
  return await User.findById(userId, USER_DATA_SELECTOR);
}

export async function getPostsByUserId(userId: string): Promise<IPost[]> {
  return await Post.find({ user: userId }, POST_DATA_SELECTOR)
    .populate("user", USER_DATA_SELECTOR)
    .sort({
      createdAt: 1,
    })
    .exec();
}

export async function getFriendsByUserId(
  userId: string
): Promise<IUser[] | string[]> {
  return (
    await User.findById(userId, "friends")
      .populate("friends", USER_DATA_SELECTOR)
      .exec()
  ).friends;
}

export async function getSentFriendRequestsByUserId(
  userId: string
): Promise<IUser[] | string[]> {
  return (
    await User.findById(userId, "sentFriendRequests")
      .populate("sentFriendRequests", USER_DATA_SELECTOR)
      .exec()
  ).sentFriendRequests;
}

export async function getFriendRequestsByUserId(
  userId: string
): Promise<IUser[] | string[]> {
  return (
    await User.findById(userId, "friendRequests")
      .populate("friendRequests", USER_DATA_SELECTOR)
      .exec()
  ).friendRequests;
}

export async function getPostById(postId: string) {
  const post = await Post.findById(postId, POST_DATA_SELECTOR)
    .populate("user", USER_DATA_SELECTOR)
    .exec();
  return { ...post.toJSON(), likes: post.likes.length };
}

export async function getPostAndLikesListById(postId: string): Promise<IPost> {
  const post = await Post.findById(postId, POST_DATA_SELECTOR)
    .populate("user", USER_DATA_SELECTOR)
    .populate("likes", USER_DATA_SELECTOR)
    .exec();
  return post;
}

export async function getLikesByPostId(postId: string): Promise<IPost> {
  return await Post.findById(postId)
    .populate("likes", USER_DATA_SELECTOR)
    .exec();
}

export async function getCommentsByPostId(postId: string): Promise<IComment[]> {
  const comment = await Comment.find({ post: postId }, COMMENT_DATA_SELECTOR)
    .populate("user", USER_DATA_SELECTOR)
    .exec();
  return comment;
}

export async function getCommentById(commentId: string): Promise<IComment> {
  return await Comment.findById(commentId, COMMENT_DATA_SELECTOR)
    .populate("user", USER_DATA_SELECTOR)
    .exec();
}
