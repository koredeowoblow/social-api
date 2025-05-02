import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

class AuthController {
  async signup(req, res) {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    try {
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashed });

      // Generate a 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code

      // Save the code in the user table (you should add a `verificationCode` field to the User model)
      user.verificationCode = verificationCode;
      await user.save();
      if (!user) {
        return res.status(400).json({ message: "User creation failed" });      
      }

      // Send email with the verification code
      await transporter.sendMail({
        from:"Socail media app <socialmedia@gmail.com>",
        to: email,
        subject: "Verify your account",
        html: `<p>Your verification code is <strong>${verificationCode}</strong>. Please enter this code to verify your account.</p>`,
      });

      res.status(200).json({ message: "Signup successful, verification code sent" });
    } catch (err) {
      res.status(500).json({ message: "Signup error", error: err.message });
    }
  }

  async resendVerification(req, res) {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Email not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "Account already verified" });

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code

    // Save the code in the user table (you should add a `verificationCode` field to the User model)
    user.verificationCode = verificationCode;
    await user.save();

    // Send email with the verification code
    await transporter.sendMail({
      from: "your-email@gmail.com",
      to: email,
      subject: "Verify your account",
      html: `<p>Your verification code is <strong>${verificationCode}</strong>. Please enter this code to verify your account.</p>`,
    });

    res.json({ message: "Verification code resent" });
  }

  async verify(req, res) {
    const { email, verificationCode } = req.body; // Accept code in the request body
    try {
      const user = await User.findOne({ where: { email } });
      if (!user)
        return res.status(400).json({ message: "Invalid verification link" });

      // Check if the provided code matches the user's verification code
      if (user.verificationCode !== parseInt(verificationCode)) {
        return res.status(400).json({ message: "Invalid verification code" });
      }

      // Mark the user as verified
      user.isVerified = true;
      user.verificationCode = null; // Clear the verification code after successful verification
      await user.save();

      res.json({ message: "Email verified, you can now log in" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Verification error", error: err.message });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    if (!email && !password)
      return res.status(400).json({ message: "Emaill and Password needed" });
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials " });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: "unverified account" });
    }
    try {
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(400).json({ message: "Invalid credentials" });

      if (user.mfaEnabled) {
        return res.json({ message: "MFA check required (not implemented)" });
      }

      req.session.userId = user.id;
      res.json({ message: "Login successful", userId: user.id });
    } catch (err) {
      res.status(500).json({ message: "Login error", error: err.message });
    }
  }

  logout(req, res) {
    req.session.destroy((err) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Logout error", error: err.message });
      res.json({ message: "Logged out successfully" });
    });
  }
}

export default new AuthController();
