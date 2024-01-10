"use strict"

const { v4: uuidv4 } = require("uuid")

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "FoodCategories",
      [
        {
          categoryId: uuidv4(),
          categoryName: "中式料理",
          isDefault: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          categoryId: uuidv4(),
          categoryName: "日式料理",
          isDefault: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          categoryId: uuidv4(),
          categoryName: "義式料理",
          isDefault: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          categoryId: uuidv4(),
          categoryName: "墨西哥料理",
          isDefault: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          categoryId: uuidv4(),
          categoryName: "美式快餐",
          isDefault: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("FoodCategories", null, {})
  },
}
