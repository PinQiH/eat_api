const crypto = require("crypto")
const moment = require("moment-timezone")
const models = require("../models")

// 生成一個唯一的重置密碼令牌
function generateResetToken() {
  return crypto.randomBytes(20).toString("hex")
}

// 將生成的令牌和其有效期儲存到數據庫中
async function saveResetTokenToDatabase(userId, token) {
  const expires = new Date(Date.now() + 3600000) // 令牌有效期設為1小時
  await models.User.update(
    {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    },
    {
      where: { userId: userId },
    }
  )
}

module.exports = {
  generateResetToken,
  saveResetTokenToDatabase,
}
