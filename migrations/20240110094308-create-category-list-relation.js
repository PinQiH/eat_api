"use strict"
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CategoryListRelations", {
      relationId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      categoryListId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "CategoryLists",
          key: "categoryListId",
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
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CategoryListRelations")
  },
}
