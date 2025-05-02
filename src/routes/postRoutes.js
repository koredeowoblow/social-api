import express from "express";
import PostController from "../controllers/postController.js";
import upload from "../config/multer.js";
import { checkSessionValidity } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post with image upload
 *     description: Create a new post with a single image file upload under the "image" field.
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content: 
 *                  type: string
 *                  description: Post content
 *                  example: "MY very first post"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Bad Request (invalid data)
 *       401:
 *         description: Unauthorized (user not authenticated)
 */
router.post(
  "/posts",
  checkSessionValidity,
  upload.single("image"),
  PostController.createPost
);

/**
 * @swagger
 * /posts/{postId}/like:
 *   post:
 *     summary: Like a specific post
 *     description: Like a post with the given `postId`.
 *     tags: [Authentication]
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: ID of the post to like
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Post liked successfully
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized (user not authenticated)
 */
router.post(
  "/posts/:postId/like",
  checkSessionValidity,
  PostController.likePost
);

/**
 * @swagger
 * /posts/{postId}/comment:
 *   post:
 *     summary: Comment on a specific post
 *     description: Add a comment to the post with the given `postId`.
 *     tags: [Authentication]
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: ID of the post to comment on
 *         required: true
 *         schema:
 *           type: string
 *       - name: comment
 *         in: body
 *         description: Comment text
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             comment:
 *               type: string
 *               example: "Great post!"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized (user not authenticated)
 */
router.post(
  "/posts/:postId/comment",
  checkSessionValidity,
  PostController.commentOnPost
);

/**
 * @swagger
 * /feed:
 *   get:
 *     summary: Get the feed of posts from users you follow
 *     description: Retrieve the feed containing posts from users you follow.
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched posts from the feed
 *       401:
 *         description: Unauthorized (user not authenticated)
 */
router.get("/feed", checkSessionValidity, PostController.getFeed);

/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Delete a specific post
 *     description: Delete the post with the given `postId`.
 *     tags: [Authentication]
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: ID of the post to delete
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized (user not authenticated)
 */
router.delete(
  "/posts/:postId",
  checkSessionValidity,
  PostController.deletePost
);

export default router;
