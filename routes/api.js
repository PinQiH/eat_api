const express = require("express")
const router = express.Router()
const apisController = require("../controllers/apisController")

// 用戶管理路由
router.post("/users/register", apisController.registerUser)
router.post("/users/login", apisController.loginUser)
router.get("/users/:userId", apisController.getUserInfo)
router.put("/users/:userId", apisController.updateUserInfo)

// 忘記密碼
router.post("/users/forgotPassword", apisController.forgotPassword)
router.get("/users/resetPassword/:token", apisController.resetPassword)

// 食物類別管理路由
router.get(
  "/categories/all",
  apisController.getAllCategoriesWithCustomAndBlacklist
)

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
router.post(
  "/users/:userId/custom-categories",
  apisController.addCustomCategory
)

router.delete(
  "/users/:userId/custom-categories/:categoryId",
  apisController.deleteCustomCategory
)

// 獲取用戶的食物類別列表
router.get("/users/:userId/category-lists", apisController.getUserCategoryLists)

// 創建新的食物類別列表
router.post("/users/:userId/category-lists", apisController.createCategoryList)

// 更新現有的食物類別列表
router.put(
  "/users/:userId/category-lists/:listId",
  apisController.updateCategoryList
)

// 查詢出屬於這個用戶且包含該食物類別的所有列表
router.get(
  "/users/:userId/categories/:categoryId/lists",
  apisController.getListsByCategoryForUser
)

// 刪除食物類別列表
router.delete(
  "/users/:userId/category-lists/:listId",
  apisController.deleteCategoryList
)

// 為特定列表添加食物類別
router.post(
  "/category-lists/:listId/categories",
  apisController.addCategoryToList
)

// 從列表中移除食物類別
router.delete(
  "/category-lists/:listId/categories/:categoryId",
  apisController.removeCategoryFromList
)

// 獲取列表中的所有食物類別
router.get(
  "/:userId/category-lists/:listId/categories",
  apisController.getListCategories
)

module.exports = router
