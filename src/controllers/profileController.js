import User from "../models/UserModel.js";

class ProfileController {
  // Create a profile
  //   async createProfile(req, res) {
  //     const { username, email, bio, profilePicture } = req.body;

  //     if (!username || !email) {
  //       return res
  //         .status(400)
  //         .json({ message: "Username and email are required." });
  //     }

  //     const existingUser = await User.findOne({ where: { email } });
  //     if (existingUser) {
  //       return res
  //         .status(400)
  //         .json({ message: "User with this email already exists." });
  //     }
  //     try {
  //       const newUser = await User.create({
  //         username,
  //         email,
  //         Bio: bio || "",
  //         profilePicture: profilePicture || "",
  //       });

  //       res
  //         .status(201)
  //         .json({ message: "Profile created successfully.", user: newUser });
  //     } catch (error) {
  //       res.status(500).json({ message: error.message });
  //     }
  //   }

  // Edit profile
  async editProfile(req, res) {
    try {
      const userId = req.user.id; // assuming auth middleware sets req.user
      const { username, bio, profilePicture, personalDetails } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      user.username = username || user.username;
      user.bio = bio || user.bio;
      user.profilePicture = profilePicture || user.profilePicture;
      user.personalDetails = personalDetails || user.personalDetails;

      await user.save();

      res.status(200).json({ message: "Profile updated successfully.", user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // View own profile
  async viewOwnProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId, {
        attributes: [
          "id",
          "username",
          "email",
          "bio",
          "proilePicture",
          "personalDetails",
        ],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // View another user's profile
  async viewUserProfile(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Target user ID is required." });
      }

      const user = await User.findByPk(id, {
        attributes: [
          "id",
          "username",
          "bio",
          "profilePicture",
          "personalDetails",
        ],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new ProfileController();
