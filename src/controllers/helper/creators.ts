import Post, { PostBase } from "../../models/post";

export async function createPost(postData: PostBase): Promise<string> {
  return (await Post.create(postData))._id;
}
