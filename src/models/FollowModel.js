import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./UserModel.js";

const Follow = sequelize.define("Follow", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  followerId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "Users",
      key: "id",
    },
  },
  followingId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "User",
      key: "id",
    },
  },
});

// Relations for eager loading
Follow.belongsTo(User, { as: "follower",  foreignKey: "userId"  });
Follow.belongsTo(User, { as: "following",  foreignKey: "userId"  });

export default Follow;
