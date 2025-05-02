import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./UserModel.js";

const Chat = sequelize.define("Chat", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Setup associations
Chat.belongsTo(User, { as: "sender", foreignKey: "senderId" });
Chat.belongsTo(User, { as: "receiver", foreignKey: "receiverId" });

export default Chat;
