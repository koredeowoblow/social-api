import express from "express";
import ProfileController from "../controllers/profileController.js";
import {
  checkSessionValidity,
  protectUser,
} from "../middleware/authMiddleware.js";

import upload from "../config/multer.js";

const router = express.Router();

/**
 * @swagger
 * /profile/edit:
 *   put:
 *     summary: Edit the user's profile
 *     description: Edit the details of the authenticated user's profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad Request (invalid data)
 *       401:
 *         description: Unauthorized (user not authenticated)
 */
router.put(
  "/edit",
  protectUser,
  checkSessionValidity,
  ProfileController.editProfile
);

/**
 * @swagger
 * /profile/view:
 *   get:
 *     summary: View the logged-in user's profile
 *     description: Get the details of the authenticated user's profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched profile details
 *       401:
 *         description: Unauthorized (user not authenticated)
 */
router.get(
  "/view",
  protectUser,
  checkSessionValidity,
  ProfileController.viewUserProfile
);

/**
 * @swagger
 * /profile/view/{id}:
 *   get:
 *     summary: View another user's profile by ID
 *     description: Get the profile details of a user by their user ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID of the profile to view
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched the profile details of the specified user
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized (user not authenticated)
 */
router.get(
  "/view/:id",
  protectUser,
  checkSessionValidity,
  ProfileController.viewOwnProfile
);

export default router;
