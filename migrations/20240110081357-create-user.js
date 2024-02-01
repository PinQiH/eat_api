"use strict"
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      userId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      username: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        unique: true, // 確保郵箱地址唯一
      },
      password: {
        type: Sequelize.STRING,
      },
      resetPasswordToken: {
        type: Sequelize.STRING, // 存儲重置密碼令牌
        allowNull: true, // 這個欄位不是每個用戶都需要，所以設為可為null
      },
      resetPasswordExpires: {
        type: Sequelize.DATE, // 存儲令牌的有效期
        allowNull: true, // 這個欄位不是每個用戶都需要，所以設為可為null
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
    await queryInterface.dropTable("Users")
  },
}
