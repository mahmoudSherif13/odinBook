import Comment, { CommentBase } from "../../models/comment";
import Post, { PostBase } from "../../models/post";

export async function createPost(postData: PostBase): Promise<string> {
  return (await Post.create(postData))._id;
}

export async function creatComment(commentData: CommentBase): Promise<string> {
  return (await Comment.create(commentData))._id;
}
