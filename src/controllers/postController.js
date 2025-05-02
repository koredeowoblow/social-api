import Post from "../models/PostModel.js";
import Like from "../models/LikeModel.js";
import Comment from "../models/CommentModel.js";
import User from "../models/UserModel.js";

class PostController {
  async createPost(req, res) {
    const { content, videoUrl } = req.body;
    const userId = req.user.id;
    let imageUrl = null;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`; // Store relative path
    }

    try {
      const post = await Post.create({ content, imageUrl, videoUrl, userId });
      res.status(201).json({ message: "Post created", post });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async likePost(req, res) {
    const { postId } = req.params;
    const userId = req.user.id;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    try {
      const existingLike = await Like.findOne({ where: { userId, postId } });
      if (existingLike) {
        return res.status(400).json({ message: "Already liked" });
      }

      await Like.create({ userId, postId });
      res.status(200).json({ message: "Post liked" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async unlikePost(req, res) {
    const { postId } = req.params;
    const userId = req.user.id;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    try {
      const like = await Like.findOne({ where: { userId, postId } });
      if (!like) {
        return res.status(400).json({ message: "Not liked yet" });
      }

      await like.destroy();
      res.status(200).json({ message: "Post unliked" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async commentOnPost(req, res) {
    const { postId } = req.params;
    const userId = req.user.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    try {
      const comment = await Comment.create({ text, userId, postId });
      res.status(201).json({ message: "Comment added", comment });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getFeed(req, res) {
    try {
      const posts = await Post.findAll({
        include: [
          { model: User, attributes: ["id", "username"] },
          { model: Like },
          {
            model: Comment,
            include: [{ model: User, attributes: ["username"] }],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async deletePost(req, res) {
    const { postId } = req.params;
    const userId = req.user.id;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      const post = await Post.findByPk(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.userId !== userId) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this post" });
      }

      await post.destroy();
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new PostController();
