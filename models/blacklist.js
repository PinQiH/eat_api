"use strict"
const { Model } = require("sequelize")
const { v4: uuidv4 } = require("uuid")

module.exports = (sequelize, DataTypes) => {
  class Blacklist extends Model {
    static associate(models) {
      Blacklist.belongsTo(models.User, { foreignKey: "userId" })
      Blacklist.belongsTo(models.FoodCategory, { foreignKey: "categoryId" })
    }
  }
  Blacklist.init(
    {
      blacklistId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: DataTypes.UUID,
      categoryId: DataTypes.UUID,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Blacklist",
      tableName: "Blacklists",
    }
  )
  return Blacklist
}
