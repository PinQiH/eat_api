"use strict"
const { Model } = require("sequelize")
const { v4: uuidv4 } = require("uuid")

module.exports = (sequelize, DataTypes) => {
  class CategoryList extends Model {
    static associate(models) {
      CategoryList.belongsTo(models.User, { foreignKey: "userId" })
      CategoryList.hasMany(models.CategoryListRelation, {
        foreignKey: "categoryListId",
      })
    }
  }
  CategoryList.init(
    {
      categoryListId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      listName: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "CategoryList",
      tableName: "CategoryLists",
    }
  )
  return CategoryList
}
