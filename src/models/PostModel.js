import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./UserModel.js";

const Post = sequelize.define("Post", {
  content: { type: DataTypes.TEXT },
  imageUrl: { type: DataTypes.STRING },
  videoUrl: { type: DataTypes.STRING },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "Users",
      key: "id"
    }
  }
});

Post.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Post, { foreignKey: "userId" });

export default Post;
