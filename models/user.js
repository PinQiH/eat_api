"use strict"
const { Model } = require("sequelize")
const { v4: uuidv4 } = require("uuid")

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Blacklist, { foreignKey: "userId" })
      User.hasMany(models.SpinnerHistory, { foreignKey: "userId" })
      User.hasMany(models.CustomFoodCategory, { foreignKey: "userId" })
      User.hasMany(models.CategoryList, { foreignKey: "userId" })
    }
  }
  User.init(
    {
      userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
    }
  )
  return User
}
