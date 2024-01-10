"use strict"

const { v4: uuidv4 } = require("uuid")

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "memos",
      [
        {
          id: uuidv4(),
          title: "範例標題",
          content: "這是一個範例內容",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("memos", null, {})
  },
}
