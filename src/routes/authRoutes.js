import express from "express";
import AuthController from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account by providing required fields.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 example: "john_doe@example.com"
 *               password:
 *                 type: string
 *                 example: "strongpassword"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad Request (invalid data)
 */
router.post("/signup", AuthController.signup);
/**
 * @swagger
 * /resend-verification:
 *   post:
 *     summary: Resend verification code
 *     description: Resend the verification code to the user's email if the account is not yet verified.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user to resend the verification code to.
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Verification code resent successfully
 *       400:
 *         description: Invalid email or account already verified
 *       500:
 *         description: Internal server error
 */
router.post("/resend-verification", AuthController.resendVerification);

/**
 * @swagger
 * /verify:
 *   get:
 *     summary: Verify user email
 *     description: Verify the user's email after registration using the token sent to the email.
 *     parameters:
 *       - name: token
 *         in: query
 *         description: Token received in the verification email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired verification token
 */
router.put("/verify", AuthController.verify);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     description: Login to the system by providing username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 example: "strongpassword"
 *     responses:
 *       200:
 *         description: Login successful (JWT token returned)
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", AuthController.login);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout the user
 *     description: Logout the currently logged-in user by invalidating their session/token.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Unauthorized (user not authenticated)
 */
router.post("/logout", AuthController.logout);

export default router;
