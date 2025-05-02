import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  // Auto-generate a UUID if not provided
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profilePicture: {
    type: DataTypes.STRING,
    defaultValue: null,
    unique: true,
  },
  Bio: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  mfaEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // Verification-related fields
  verificationCode: {
    type: DataTypes.STRING,
    allowNull: true, // Initially null, populated when the user signs up
  },
  verificationCodeExpiration: {
    type: DataTypes.DATE,
    allowNull: true, // Initially null, populated when the user signs up
  },
});

export default User;
