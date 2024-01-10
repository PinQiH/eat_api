"use strict"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Memo extends Model {
    static associate(models) {
      // 定義關聯可以在這裡
    }
  }

  Memo.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Memo",
      tableName: "memos", // 明確指定表名
      timestamps: true, // 啟用 createdAt 和 updatedAt
      freezeTableName: true, // 使用單數表格名
    }
  )

  return Memo
}
