const nodemailer = require("nodemailer")

async function sendResetPasswordEmail(email, token) {
  let transporter = nodemailer.createTransport({
    // 設置郵件客戶端（以 Gmail 為例）
    service: "gmail",
    auth: {
      user: "cassie34131@gmail.com",
      pass: "nenh lbwp xpaq xofz",
    },
  })

  let mailOptions = {
    from: '"今天吃什麼" <cassie34131@gmail.com>',
    to: email,
    subject: "重置密碼",
    text:
      `您收到這封郵件是因為您（或者某人）請求重置您的帳戶密碼。\n\n` +
      `請複製以下驗證碼至APP驗證：\n\n` +
      `${token}\n\n` +
      `如果您沒有請求此操作，請忽略這封郵件並且您的密碼將保持不變。\n`,
  }

  // 發送郵件
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log("重置密碼郵件已發送: %s", info.response)
  })
}

module.exports = {
  sendResetPasswordEmail,
}
