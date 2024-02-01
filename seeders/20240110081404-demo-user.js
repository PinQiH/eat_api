"use strict"

const { v4: uuidv4 } = require("uuid")

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          userId: uuidv4(),
          username: "示例用戶",
          email: "cassie34131@gmail.com",
          password: "12345",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {})
  },
}
