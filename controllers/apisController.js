const models = require("../models")
const bcrypt = require("bcryptjs")

const apisController = {}

// 用戶註冊
apisController.registerUser = async (req, res) => {
  try {
    // 從請求體中獲取用戶資料
    const { username, email, password } = req.body

    // 驗證用戶資料
    if (!username || !email || !password) {
      return res.status(400).json({ message: "缺少必要的用戶資訊。" })
    }

    // 檢查郵箱是否已被註冊
    const existingUser = await models.User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: "郵箱已被註冊。" })
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10)

    // 創建新用戶
    const newUser = await models.User.create({
      username,
      email,
      password: hashedPassword,
    })

    // 返回成功響應
    return res.status(201).json({
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      message: "註冊成功。",
    })
  } catch (error) {
    // 處理錯誤
    return res.status(500).json({ error: error.message })
  }
}

// 用戶登錄
apisController.loginUser = async (req, res) => {
  // TODO: 實現用戶登錄邏輯
}

// 獲取用戶資訊
apisController.getUserInfo = async (req, res) => {
  // TODO: 實現獲取用戶資訊邏輯
}

// 更新用戶資訊
apisController.updateUserInfo = async (req, res) => {
  // TODO: 實現更新用戶資訊邏輯
}

// 獲取所有食物類別
apisController.getAllCategories = async (req, res) => {
  try {
    // 從資料庫中查詢所有食物類別
    const categories = await models.FoodCategory.findAll()
    // 返回查詢結果
    res.status(200).json(categories)
  } catch (error) {
    // 處理可能的錯誤
    res.status(500).json({ error: error.message })
  }
}

// 添加新的食物類別
apisController.addCategory = async (req, res) => {
  // TODO: 實現添加食物類別邏輯
}

// 獲取用戶黑名單
apisController.getUserBlacklist = async (req, res) => {
  // TODO: 實現獲取用戶黑名單邏輯
}

// 添加食物到黑名單
apisController.addToBlacklist = async (req, res) => {
  // TODO: 實現添加食物到黑名單邏輯
}

// 從黑名單中移除食物
apisController.removeFromBlacklist = async (req, res) => {
  // TODO: 實現從黑名單移除食物邏輯
}

// 獲取用戶的轉盤歷史
apisController.getSpinnerHistory = async (req, res) => {
  // TODO: 實現獲取轉盤歷史邏輯
}

// 添加轉盤歷史記錄
apisController.addSpinnerHistory = async (req, res) => {
  // TODO: 實現添加轉盤歷史邏輯
}

// 獲取用戶自定義食物類別
apisController.getCustomCategories = async (req, res) => {
  // TODO: 實現獲取用戶自定義食物類別邏輯
}

// 添加用戶自定義食物類別
apisController.addCustomCategory = async (req, res) => {
  // TODO: 實現添加用戶自定義食物類別邏輯
}

module.exports = apisController
