import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./UserModel.js";

const Notification = sequelize.define("Notification", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  type: {
    type: DataTypes.STRING, // 'like', 'comment', 'follow'
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "Users",
      key: "id",
    },
  },
  fromUserId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "Users",
      key: "id",
    },
  },

  postId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Optional: set relation to fetch the user who triggered the notification
Notification.belongsTo(User, { as: "fromUser", foreignKey: "userId" });

export default Notification;
