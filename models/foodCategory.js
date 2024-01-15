"use strict"
const { Model } = require("sequelize")
const { v4: uuidv4 } = require("uuid")

module.exports = (sequelize, DataTypes) => {
  class FoodCategory extends Model {
    static associate(models) {
      FoodCategory.hasMany(models.Blacklist, { foreignKey: "categoryId" })
      FoodCategory.hasMany(models.CategoryListRelation, {
        foreignKey: "categoryId",
      })
    }
  }
  FoodCategory.init(
    {
      categoryId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      categoryName: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "FoodCategory",
      tableName: "FoodCategories",
    }
  )
  return FoodCategory
}
