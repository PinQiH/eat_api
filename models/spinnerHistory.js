"use strict"
const { Model } = require("sequelize")
const { v4: uuidv4 } = require("uuid")

module.exports = (sequelize, DataTypes) => {
  class SpinnerHistory extends Model {
    static associate(models) {
      SpinnerHistory.belongsTo(models.User, { foreignKey: "userId" })
    }
  }
  SpinnerHistory.init(
    {
      historyId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "SpinnerHistory",
      tableNaame: "SpinnerHistories",
      timestamps: true,
      updatedAt: false, // 因为没有提到更新时间，所以这里设置为false
    }
  )
  return SpinnerHistory
}
