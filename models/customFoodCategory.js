"use strict"
const { Model } = require("sequelize")
const { v4: uuidv4 } = require("uuid")

module.exports = (sequelize, DataTypes) => {
  class CustomFoodCategory extends Model {
    static associate(models) {
      CustomFoodCategory.belongsTo(models.User, { foreignKey: "userId" })
    }
  }
  CustomFoodCategory.init(
    {
      customCategoryId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      categoryName: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "CustomFoodCategory",
      tableName: "CustomFoodCategories",
    }
  )
  return CustomFoodCategory
}
