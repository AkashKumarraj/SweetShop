const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "USER",
    allowNull: false,
    set(value) {
      this.setDataValue("role", value ? value.toUpperCase() : "USER");
    },
  },
}, {
  tableName: "users",
  timestamps: true,
});

module.exports = User;
