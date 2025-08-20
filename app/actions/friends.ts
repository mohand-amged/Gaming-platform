"use server";
import User from "../models/user";
import { protect } from "./auth";

export const sendFriendRequest = async (friendId: string) => {
  try {
    const { decode } = await protect();
    const userId = (decode as { id: string }).id;

    // Check if users exist
    const [user, friend] = await Promise.all([
      User.findById(userId),
      User.findById(friendId)
    ]);

    if (!user || !friend) {
      return { error: "User not found" };
    }

    // Check if already friends
    if (user.friends.includes(friendId)) {
      return { error: "Already friends" };
    }

    // Check if request already sent
    if (user.sentFriendRequests.includes(friendId)) {
      return { error: "Friend request already sent" };
    }

    // Check if already received request
    if (user.friendRequests.includes(friendId)) {
      return { error: "Friend request already received" };
    }

    // Add to sent requests
    user.sentFriendRequests.push(friendId);
    friend.friendRequests.push(userId);

    await Promise.all([user.save(), friend.save()]);

    return { success: "Friend request sent" };
  } catch (error) {
    console.error("Send friend request error:", error);
    return { error: "Failed to send friend request" };
  }
};

export const acceptFriendRequest = async (friendId: string) => {
  try {
    const { decode } = await protect();
    const userId = (decode as { id: string }).id;

    const [user, friend] = await Promise.all([
      User.findById(userId),
      User.findById(friendId)
    ]);

    if (!user || !friend) {
      return { error: "User not found" };
    }

    // Remove from requests
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);
    friend.sentFriendRequests = friend.sentFriendRequests.filter(id => id.toString() !== userId);

    // Add to friends
    user.friends.push(friendId);
    friend.friends.push(userId);

    await Promise.all([user.save(), friend.save()]);

    return { success: "Friend request accepted" };
  } catch (error) {
    console.error("Accept friend request error:", error);
    return { error: "Failed to accept friend request" };
  }
};

export const rejectFriendRequest = async (friendId: string) => {
  try {
    const { decode } = await protect();
    const userId = (decode as { id: string }).id;

    const [user, friend] = await Promise.all([
      User.findById(userId),
      User.findById(friendId)
    ]);

    if (!user || !friend) {
      return { error: "User not found" };
    }

    // Remove from requests
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);
    friend.sentFriendRequests = friend.sentFriendRequests.filter(id => id.toString() !== userId);

    await Promise.all([user.save(), friend.save()]);

    return { success: "Friend request rejected" };
  } catch (error) {
    console.error("Reject friend request error:", error);
    return { error: "Failed to reject friend request" };
  }
};

export const removeFriend = async (friendId: string) => {
  try {
    const { decode } = await protect();
    const userId = (decode as { id: string }).id;

    const [user, friend] = await Promise.all([
      User.findById(userId),
      User.findById(friendId)
    ]);

    if (!user || !friend) {
      return { error: "User not found" };
    }

    // Remove from friends
    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== userId);

    await Promise.all([user.save(), friend.save()]);

    return { success: "Friend removed" };
  } catch (error) {
    console.error("Remove friend error:", error);
    return { error: "Failed to remove friend" };
  }
};

export const getFriends = async () => {
  try {
    const { decode } = await protect();
    const userId = (decode as { id: string }).id;

    const user = await User.findById(userId)
      .populate('friends', 'name email avatar bio')
      .populate('friendRequests', 'name email avatar bio')
      .populate('sentFriendRequests', 'name email avatar bio');

    if (!user) {
      return { error: "User not found" };
    }

    return {
      friends: user.friends,
      friendRequests: user.friendRequests,
      sentFriendRequests: user.sentFriendRequests
    };
  } catch (error) {
    console.error("Get friends error:", error);
    return { error: "Failed to get friends" };
  }
};

export const searchUsers = async (query: string) => {
  try {
    const { decode } = await protect();
    const userId = (decode as { id: string }).id;

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ],
      _id: { $ne: userId }
    }).select('name email avatar bio');

    return { users };
  } catch (error) {
    console.error("Search users error:", error);
    return { error: "Failed to search users" };
  }
};
