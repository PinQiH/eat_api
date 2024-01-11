const express = require("express")
const router = express.Router()
const apisController = require("../controllers/apisController")

// 用戶管理路由
router.post("/api/users/register", apisController.registerUser)
router.post("/api/users/login", apisController.loginUser)
router.get("/api/users/:userId", apisController.getUserInfo)
router.put("/api/users/:userId", apisController.updateUserInfo)

// 食物類別管理路由
router.get("/api/categories", apisController.getAllCategories)
router.post("/api/categories", apisController.addCategory)

// 用戶黑名單管理路由
router.get("/api/users/:userId/blacklist", apisController.getUserBlacklist)
router.post("/api/users/:userId/blacklist", apisController.addToBlacklist)
router.delete(
  "/api/users/:userId/blacklist/:categoryId",
  apisController.removeFromBlacklist
)

// 轉盤歷史記錄路由
router.get(
  "/api/users/:userId/spinner-history",
  apisController.getSpinnerHistory
)
router.post(
  "/api/users/:userId/spinner-history",
  apisController.addSpinnerHistory
)

// 用戶自定義食物類別路由
router.get(
  "/api/users/:userId/custom-categories",
  apisController.getCustomCategories
)
router.post(
  "/api/users/:userId/custom-categories",
  apisController.addCustomCategory
)

module.exports = router
