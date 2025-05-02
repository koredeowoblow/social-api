import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./UserModel.js";
import Post from "./PostModel.js";

const Comment = sequelize.define("Comment", {
  text: { type: DataTypes.TEXT, allowNull: false },
});

Comment.belongsTo(User, { foreignKey: "userId" });
Comment.belongsTo(Post, { foreignKey: "postId" });

export default Comment;
