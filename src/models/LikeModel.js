import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./UserModel.js";
import Post from "./PostModel.js";

const Like = sequelize.define("Like", {});

Like.belongsTo(User, { foreignKey: "userId" });
Like.belongsTo(Post, { foreignKey: "postId" });

export default Like;
