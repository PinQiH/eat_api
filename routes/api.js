const express = require("express")
const router = express.Router()
const apisController = require("../controllers/apisController")

// 用戶管理路由
router.post("/users/register", apisController.registerUser)
router.post("/users/login", apisController.loginUser)
router.get("/users/:userId", apisController.getUserInfo)
router.put("/users/:userId", apisController.updateUserInfo)

// 食物類別管理路由
router.get("/categories", apisController.getAllCategories)
router.post("/categories", apisController.addCategory)

// 用戶黑名單管理路由
router.get("/users/:userId/blacklist", apisController.getUserBlacklist)
router.post("/users/:userId/blacklist", apisController.addToBlacklist)
router.delete(
  "/users/:userId/blacklist/:categoryId",
  apisController.removeFromBlacklist
)

// 轉盤歷史記錄路由
router.get("/users/:userId/spinner-history", apisController.getSpinnerHistory)
router.post("/users/:userId/spinner-history", apisController.addSpinnerHistory)

// 用戶自定義食物類別路由
router.get(
  "/users/:userId/custom-categories",
  apisController.getCustomCategories
)
router.post(
  "/users/:userId/custom-categories",
  apisController.addCustomCategory
)
router.delete(
  "/users/:userId/custom-categories/:categoryId",
  apisController.deleteCustomCategory
)

module.exports = router
