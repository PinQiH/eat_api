"use strict"
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SpinnerHistories", {
      historyId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "userId",
        },
      },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "FoodCategories",
          key: "categoryId",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("SpinnerHistories")
  },
}
