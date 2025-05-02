import sequelize from "sequelize";
import User from "../models/UserModel.js";
import Follow from "../models/FollowModel.js";
import Post from "../models/PostModel.js";
import Notification from "../models/NotificationModel.js";
import Chat from "../models/ChatModel.js";

class UserController {
  // Follow a user
  static async followUser(req, res) {
    const { id: targetId } = req.params;
    const currentUserId = req.user.id;

    if (!targetId) {
      return res.status(400).json({ message: "Target user ID is required." });
    }
    if (targetId === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }

    const targetUser = await User.findByPk(targetId);
    if (!targetUser) {
      return res.status(404).json({ message: "User to follow not found." });
    }

    try {
      const [follow, created] = await Follow.findOrCreate({
        where: { followerId: currentUserId, followingId: targetId },
      });

      if (!created) {
        return res
          .status(400)
          .json({ message: "Already following this user." });
      }

      return res.status(200).json({ message: "User followed successfully." });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Unfollow a user
  static async unfollowUser(req, res) {
    const { id: targetId } = req.params;
    const currentUserId = req.user.id;

    if (!targetId) {
      return res.status(400).json({ message: "Target user ID is required." });
    }

    try {
      const follow = await Follow.findOne({
        where: { followerId: currentUserId, followingId: targetId },
      });

      if (!follow) {
        return res
          .status(400)
          .json({ message: "You are not following this user." });
      }

      await follow.destroy();
      return res.status(200).json({ message: "User unfollowed successfully." });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get followers
  static async getFollowers(req, res) {
    const currentUserId = req.user.id;

    if (!currentUserId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const user = await User.findByPk(currentUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    try {
      const followers = await Follow.findAll({
        where: { followingId: currentUserId },
        include: [
          {
            model: User,
            as: "follower",
            attributes: ["id", "username", "email"],
          },
        ],
      });

      return res.status(200).json({ count: followers.length, followers });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get following
  static async getFollowing(req, res) {
    const currentUserId = req.user.id;

    if (!currentUserId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    try {
      const following = await Follow.findAll({
        where: { followerId: currentUserId },
        include: [
          {
            model: User,
            as: "following",
            attributes: ["id", "username", "email"],
          },
        ],
      });

      return res.status(200).json({ count: following.length, following });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get another user's followers
  static async getUserFollowers(req, res) {
    const { id: targetId } = req.params;

    if (!targetId) {
      return res.status(400).json({ message: "Target user ID is required." });
    }

    try {
      const followers = await Follow.findAll({
        where: { followingId: targetId },
        include: [
          {
            model: User,
            as: "follower",
            attributes: ["id", "username", "email"],
          },
        ],
      });

      return res.status(200).json({ count: followers.length, followers });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get another user's following

  static async getUserFollowing(req, res) {
    const { id: targetId } = req.params;

    if (!targetId) {
      return res.status(400).json({ message: "Target user ID is required." });
    }
    

    try {
      const following = await Follow.findAll({
        where: { followerId: targetId },
        include: [
          {
            model: User,
            as: "following",
            attributes: ["id", "username", "email"],
          },
        ],
      });

      return res.status(200).json({ count: following.length, following });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get feed
  static async getFeed(req, res) {
    const currentUserId = req.user.id;

    if (!currentUserId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    try {
      const following = await Follow.findAll({
        where: { followerId: currentUserId },
        attributes: ["followingId"],
      });

      const followingIds = following.map((f) => f.followingId);

      const posts = await Post.findAll({
        where: { userId: followingIds },
        order: [["createdAt", "DESC"]],
        include: [
          { model: User, attributes: ["id", "username", "profilePicture"] },
        ],
      });

      return res.json(posts);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get notifications
  static async getNotifications(req, res) {
    const currentUserId = req.user.id;

    if (!currentUserId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    try {
      const notifications = await Notification.findAll({
        where: { userId: currentUserId },
        order: [["createdAt", "DESC"]],
        include: [
          { model: User, as: "fromUser", attributes: ["id", "username"] },
        ],
      });

      return res.json(notifications);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Mark notifications as read
  static async markNotificationsRead(req, res) {
    const currentUserId = req.user.id;

    if (!currentUserId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    try {
      await Notification.update(
        { isRead: true },
        { where: { userId: currentUserId, isRead: false } }
      );
      return res.json({ message: "All unread notifications marked as read" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async markAllNotificationsRead(req, res) {
    const currentUserId = req.user.id;

    if (!currentUserId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    try {
      await Notification.update(
        { isRead: true },
        { where: { userId: currentUserId } }
      );
      return res.json({ message: "All notifications marked as read" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Send message
  static async sendMessage(req, res) {
    const senderId = req.user.id;
    const { receiverId, message } = req.body;

    if (!receiverId || !message) {
      return res
        .status(400)
        .json({ message: "Receiver ID and message are required." });
    }

    try {
      const chat = await Chat.create({ senderId, receiverId, message });
      return res.status(201).json({ message: "Message sent.", chat });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get conversation between two users
  static async getConversation(req, res) {
    const currentUserId = req.user.id;
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Target user ID is required." });
    }

    try {
      const messages = await Chat.findAll({
        where: {
          [sequelize.Op.or]: [
            { senderId: currentUserId, receiverId: userId },
            { senderId: userId, receiverId: currentUserId },
          ],
        },
        order: [["createdAt", "ASC"]],
      });

      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get chat list (all chats)
  static async getChatList(req, res) {
    const currentUserId = req.user.id;

    if (!currentUserId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    try {
      const chats = await Chat.findAll({
        where: {
          [sequelize.Op.or]: [
            { senderId: currentUserId },
            { receiverId: currentUserId },
          ],
        },
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json(chats);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get unread messages count
  static async getUnreadMessagesCount(req, res) {
    const currentUserId = req.user.id;

    if (!currentUserId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    try {
      const count = await Chat.count({
        where: { receiverId: currentUserId, isRead: false },
      });

      return res.status(200).json({ unreadCount: count });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get last message between two users
  static async getLastMessage(req, res) {
    const currentUserId = req.user.id;
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Target user ID is required." });
    }

    try {
      const lastMessage = await Chat.findOne({
        where: {
          [sequelize.Op.or]: [
            { senderId: currentUserId, receiverId: userId },
            { senderId: userId, receiverId: currentUserId },
          ],
        },
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json(lastMessage);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get all messages by user ID (with another user)
  static async getMessagesByUserId(req, res) {
    const currentUserId = req.user.id;
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Target user ID is required." });
    }

    try {
      const messages = await Chat.findAll({
        where: {
          [sequelize.Op.or]: [
            { senderId: currentUserId, receiverId: userId },
            { senderId: userId, receiverId: currentUserId },
          ],
        },
        order: [["createdAt", "ASC"]],
      });

      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default UserController;
