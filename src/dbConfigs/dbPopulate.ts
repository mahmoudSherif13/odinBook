import { controllerFunction } from "../controllers/helper/types";
import {
  generateDbComment,
  generateDbFriend,
  generateDbLike,
  generateDbPost,
  generateDbUser,
} from "../test/helper/helper";

async function genPosts(user, users) {
  const posts = [];
  for (let i = 0; i < 5; i++) {
    posts.push(await generateDbPost(user));
    for (let j = 0; j < users.length; j++) {
      await generateDbLike(users[j], posts[posts.length - 1]);
    }
  }
  return posts;
}

async function genComments(post, users) {
  for (let i = 0; i < users.length; i++) {
    await generateDbComment(users[i], post);
  }
}
export const dbPop: controllerFunction = async (req, res, next) => {
  const user = await generateDbUser({
    firstName: "Omar",
    lastName: "El Bohoty",
    email: "bohoty@gmail.com",
    password: "bohoty",
  });
  const friends = [
    await generateDbFriend(user),
    await generateDbFriend(user),
    await generateDbFriend(user),
    await generateDbFriend(user),
    await generateDbFriend(user),
  ];
  let posts = await genPosts(user, friends.concat(user));
  for (let i = 0; i < friends.length; i++) {
    posts = posts.concat(await genPosts(friends[i], friends.concat(user)));
  }
  for (let i = 0; i < posts.length; i++) {
    await genComments(posts[i], friends.concat(user));
  }
  res.json({ message: "done" });
};
