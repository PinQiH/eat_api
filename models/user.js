"use strict"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // 保持現有的關聯不變
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
      email: {
        type: DataTypes.STRING,
        unique: true, // 確保郵箱地址唯一
      },
      password: DataTypes.STRING,
      // 新增 resetPasswordToken 和 resetPasswordExpires
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true, // 允許為 null，因為不是所有用戶都會使用到重置密碼功能
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true, // 允許為 null
      },
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
