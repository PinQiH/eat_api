"use strict"
const { Model } = require("sequelize")
const { v4: uuidv4 } = require("uuid")

module.exports = (sequelize, DataTypes) => {
  class CategoryListRelation extends Model {
    static associate(models) {
      // 關聯到分類列表表
      CategoryListRelation.belongsTo(models.CategoryList, {
        foreignKey: "categoryListId",
      })
      // 關聯到食物類別表
      CategoryListRelation.belongsTo(models.FoodCategory, {
        foreignKey: "categoryId",
      })
    }
  }
  CategoryListRelation.init(
    {
      relationId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      categoryListId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "CategoryListRelation",
      tableName: "CategoryListRelations",
    }
  )
  return CategoryListRelation
}
