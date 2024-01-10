"use strict"
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CustomFoodCategories", {
      customCategoryId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users", // 對應用戶表名稱
          key: "userId",
        },
      },
      categoryName: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CustomFoodCategories")
  },
}
