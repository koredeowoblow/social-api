import express from "express";
import UserController from "../controllers/socialController.js";
import {
  protectUser,
  checkSessionValidity,
} from "../middleware/authMiddleware.js";


const router = express.Router();

/**
 * @swagger
 * /follow/{id}:
 *   post:
 *     summary: Follow another user
 *     description: Follow a user by their ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID to follow
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully followed user
 *       400:
 *         description: Bad Request
 */
router.post(
  "/follow/:id",
  checkSessionValidity,
  protectUser,
  UserController.followUser
);

/**
 * @swagger
 * /unfollow/{id}:
 *   put:
 *     summary: Unfollow a user
 *     description: Unfollow a user by their ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID to unfollow
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully unfollowed user
 *       400:
 *         description: Bad Request
 */
router.put(
  "/unfollow/:id",
  checkSessionValidity,
  protectUser,
  UserController.unfollowUser
);

// ---------- FOLLOWERS & FOLLOWING ----------
/**
 * @swagger
 * /followers:
 *   get:
 *     summary: Get your followers
 *     description: Retrieve a list of users who follow you
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of followers
 */
router.get(
  "/followers",
  checkSessionValidity,
  protectUser,
  UserController.getFollowers
);

/**
 * @swagger
 * /following:
 *   get:
 *     summary: Get your following list
 *     description: Retrieve a list of users you are following
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of following users
 */
router.get(
  "/following",
  checkSessionValidity,
  protectUser,
  UserController.getFollowing
);

/**
 * @swagger
 * /{id}/followers:
 *   get:
 *     summary: Get followers of a specific user
 *     description: Get a list of users who follow the specified user
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID whose followers to fetch
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of followers of the specific user
 */
router.get(
  "/:id/followers",
  checkSessionValidity,
  protectUser,
  UserController.getUserFollowers
);

/**
 * @swagger
 * /{id}/following:
 *   get:
 *     summary: Get following list of a specific user
 *     description: Get a list of users the specified user is following
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID whose following list to fetch
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of following users of the specific user
 */
router.get(
  "/:id/following",
  checkSessionValidity,
  protectUser,
  UserController.getUserFollowing
);

// ---------- FEED ----------

/**
 * @swagger
 * /feed:
 *   get:
 *     summary: Get feed (posts from users you follow)
 *     description: Get posts from users you follow
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of posts from followed users
 */
router.get("/feed", checkSessionValidity, protectUser, UserController.getFeed);

// ---------- NOTIFICATIONS ----------

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get notifications
 *     description: Get the list of notifications for the logged-in user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get(
  "/notifications",
  checkSessionValidity,
  protectUser,
  UserController.getNotifications
);

/**
 * @swagger
 * /notifications/mark-read:
 *   put:
 *     summary: Mark notifications as read
 *     description: Mark all notifications as read
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications marked as read
 */
router.put(
  "/notifications/mark-read",
  checkSessionValidity,
  protectUser,
  UserController.markNotificationsRead
);

/**
 * @swagger
 * /notifications/mark-all-read:
 *   put:
 *     summary: Mark all notifications as read
 *     description: Mark all notifications as read for the logged-in user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.put(
  "/notifications/mark-all-read",
  checkSessionValidity,
  protectUser,
  UserController.markAllNotificationsRead
);

// ---------- CHAT ----------

/**
 * @swagger
 * /chat/send:
 *   post:
 *     summary: Send a message
 *     description: Send a message to a user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Message sent successfully
 */
router.post(
  "/chat/send",
  checkSessionValidity,
  protectUser,
  UserController.sendMessage
);

/**
 * @swagger
 * /chat/{userId}:
 *   get:
 *     summary: Get conversation with a specific user
 *     description: Get the conversation with the user specified by `userId`
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of the user to get the conversation with
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Conversation with the user
 */
router.get(
  "/chat/:userId",
  checkSessionValidity,
  protectUser,
  UserController.getConversation
);

export default router;
