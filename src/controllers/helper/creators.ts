import User, { UserBase } from "../../models/user";
import Comment, { CommentBase } from "../../models/comment";
import Post, { PostBase } from "../../models/post";
import * as bcrypt from "bcryptjs";
import Chat, { MessageBase, messageState } from "../../models/chat";
import { MESSAGE_SELECTOR } from "../helper/selectors";

export async function createUser(userData: UserBase): Promise<string> {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  userData.password = hashedPassword;
  return (await User.create(userData))._id;
}

export async function createPost(postData: PostBase): Promise<string> {
  return (await Post.create(postData))._id;
}

export async function creatComment(commentData: CommentBase): Promise<string> {
  return (await Comment.create(commentData))._id;
}

export async function addLike(postId: string, userId: string): Promise<void> {
  await Post.findByIdAndUpdate(postId, {
    $addToSet: { likes: userId },
  });
}

export async function createFriendRequest(
  userId: string,
  friendId: string
): Promise<void> {
  await User.findByIdAndUpdate(friendId, {
    $addToSet: { friendRequests: userId },
  }).exec();
  await User.findByIdAndUpdate(userId, {
    $addToSet: { sentFriendRequests: friendId },
  }).exec();
}

export async function responseToFriendRequest(
  userId: string,
  friendId: string,
  response: string
): Promise<void> {
  await User.findByIdAndUpdate(userId, {
    $pull: { friendRequests: friendId },
  });
  await User.findByIdAndUpdate(friendId, {
    $pull: { sentFriendRequests: userId },
  });

  if (response === "accept") {
    await User.findByIdAndUpdate(userId, {
      $addToSet: { friends: friendId },
    });
    await User.findByIdAndUpdate(friendId, {
      $addToSet: { friends: userId },
    });
  }
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

export async function createChat(
  userId: string,
  friendId: string
): Promise<string> {
  return (
    await Chat.create({
      users: [userId, friendId],
    })
  )._id;
}

export async function createMessage(
  chatId: string,
  messageData: MessageBase
): Promise<MessageBase> {
  await Chat.findByIdAndUpdate(chatId, {
    $push: {
      messages: {
        ...messageData,
        state: messageState.hold,
      },
    },
  });
  const chat = await Chat.findById(chatId, MESSAGE_SELECTOR).slice(
    "messages",
    -1
  );
  return chat.messages[0];
}
