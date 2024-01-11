const models = require("../models")

const apisController = {}

// 用戶註冊
apisController.registerUser = async (req, res) => {
  // TODO: 實現用戶註冊邏輯
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
  // TODO: 實現獲取所有食物類別邏輯
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
