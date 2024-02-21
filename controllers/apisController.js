const models = require("../models")
const bcrypt = require("bcryptjs")
const moment = require("moment-timezone")
const { Sequelize, Op } = require("sequelize")
const {
  generateResetToken,
  saveResetTokenToDatabase,
} = require("../utils/tokenGenerator")
const { sendResetPasswordEmail } = require("../utils/emailService")

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
    console.log({ error: error.message })
    return res.status(500).json({ error: "發生未知錯誤" })
  }
}

// 用戶登錄
apisController.loginUser = async (req, res) => {
  try {
    // 從請求體中獲取電子郵件和密碼
    const { email, password } = req.body

    // 驗證電子郵件和密碼是否提供
    if (!email || !password) {
      return res.status(400).json({ message: "請提供電子郵件和密碼。" })
    }

    // 在數據庫中查找用戶
    const user = await models.User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({ message: "無效的登錄憑證。" })
    }

    // 比較密碼
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "無效的登錄憑證。" })
    }

    // TODO: 生成令牌（如 JWT），這裡只是返回用戶信息作為示例
    res.status(200).json({ message: "登錄成功", userId: user.userId })
  } catch (error) {
    // 處理錯誤
    console.log({ error: error.message })
    return res.status(500).json({ error: "發生未知錯誤" })
  }
}

// 獲取用戶資訊
apisController.getUserInfo = async (req, res) => {
  try {
    // 從請求參數中獲取用戶ID
    const userId = req.params.userId

    // 在數據庫中查找用戶
    const user = await models.User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ message: "用戶未找到。" })
    }

    // 返回用戶資訊（去除敏感資訊，如密碼）
    return res.status(200).json({
      userId: user.userId,
      username: user.username,
      email: user.email,
      // 其他需要返回的用戶資訊
    })
  } catch (error) {
    // 處理錯誤
    console.log({ error: error.message })
    return res.status(500).json({ error: "發生未知錯誤" })
  }
}

// 更新用戶資訊
apisController.updateUserInfo = async (req, res) => {
  try {
    // 從請求參數中獲取用戶ID
    const userId = req.params.userId

    // 從請求體中獲取要更新的資料，包括密碼
    const { username, email, password } = req.body

    // 更新的對象
    const updatedData = { username, email, password }

    // 如果提供了新密碼，則加密並添加到更新對象中
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updatedData.password = hashedPassword
    }

    // 在數據庫中找到並更新用戶
    const [updated] = await models.User.update(updatedData, {
      where: { userId: userId },
    })

    if (!updated) {
      return res.status(404).json({ message: "用戶未找到。" })
    }

    // 返回成功響應
    return res.status(200).json({ message: "用戶資訊已更新。" })
  } catch (error) {
    // 處理錯誤
    console.log({ error: error.message })
    return res.status(500).json({ error: "發生未知錯誤" })
  }
}

// 忘記密碼
apisController.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ message: "請提供郵箱地址。" })
    }

    const user = await models.User.findOne({ where: { email } })
    if (!user) {
      // 為了避免洩露郵箱信息，即使郵箱不存在也返回成功響應
      return res.status(200).json({
        message: "如果該郵箱存在於我們的系統中，我們將發送一個驗證碼到該郵箱。",
      })
    }

    // 生成重置密碼令牌
    const resetToken = generateResetToken()

    // 儲存令牌到數據庫 (考慮加密令牌並設置有效期)
    await saveResetTokenToDatabase(user.userId, resetToken)

    // 發送重置密碼郵件
    await sendResetPasswordEmail(email, resetToken)

    return res.status(200).json({ message: "驗證碼已發送到您的郵箱。" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "無法處理忘記密碼請求。" })
  }
}

// 重設密碼
apisController.resetPassword = async (req, res) => {
  try {
    const { token } = req.params

    // 在數據庫中查找相對應的用戶
    const user = await models.User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          // 確保令牌沒有過期
          [Op.gt]: Date.now(),
        },
      },
      attributes: ["userId", "resetPasswordExpires"],
    })

    if (!user) {
      // 令牌無效或已過期
      return res.status(400).json({
        message: "驗證連結過期",
      })
    }

    // 令牌驗證通過，顯示重置密碼的表單
    return res.status(200).json({
      message: "驗證成功，即將跳轉至重設密碼頁面",
      userId: user.userId,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "發生未知錯誤" })
  }
}

// 獲取所有食物類別包含使用者新增及黑名單
apisController.getAllCategoriesWithCustomAndBlacklist = async (req, res) => {
  try {
    const userId = req.query.userId // 假設用戶ID從查詢參數中獲取

    const page = parseInt(req.query.page) || 1 // 預設為第1頁
    const pageSize = parseInt(req.query.pageSize) || 10 // 預設每頁10條記錄

    // 計算查詢的offset
    const offset = (page - 1) * pageSize

    // 從資料庫中查詢所有標準食物類別
    let categories = await models.FoodCategory.findAll({
      attributes: [
        "categoryId",
        "categoryName",
        [Sequelize.literal("false"), "isBlacklisted"],
      ],
      limit: pageSize,
      offset: offset,
    })

    // 若提供了用戶ID，則查詢用戶自定義的食物類別和黑名單
    if (userId) {
      // 獲取用戶自定義的食物類別
      const customCategories = await models.CustomFoodCategory.findAll({
        where: { userId },
        attributes: [
          ["customCategoryId", "categoryId"],
          "categoryName",
          [Sequelize.literal("false"), "isBlacklisted"],
        ],
      })

      // 獲取用戶的黑名單
      const blacklist = await models.Blacklist.findAll({
        where: { userId },
        attributes: ["categoryId"],
      })
      const blacklistIds = blacklist.map((entry) => entry.categoryId)

      // 將自定義類別合併到結果中，並對黑名單中的類別進行標示
      categories = categories.concat(customCategories).map((category) => {
        return {
          ...category.get({ plain: true }),
          isBlacklisted: blacklistIds.includes(category.categoryId),
          isCustom: category instanceof models.CustomFoodCategory,
        }
      })
    }

    // 返回查詢結果
    res.status(200).json(categories)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "發生未知錯誤" })
  }
}

// 獲取用戶黑名單
apisController.getUserBlacklist = async (req, res) => {
  try {
    // 從請求參數中獲取用戶ID
    const userId = req.params.userId

    const page = parseInt(req.query.page) || 1 // 預設為第1頁
    const pageSize = parseInt(req.query.pageSize) || 10 // 預設每頁10條記錄

    // 計算查詢的offset
    const offset = (page - 1) * pageSize

    // 在數據庫中查找用戶的黑名單
    const userBlacklist = await models.Blacklist.findAll({
      where: { userId },
      limit: pageSize,
      offset: offset,
    })

    if (userBlacklist.length === 0) {
      return res.status(200).json({ message: "未找到黑名單信息。" })
    }

    // 並行查找食物類別和自定義食物類別
    const categoryIds = userBlacklist.map((item) => item.categoryId)
    const [standardCategories, customCategories] = await Promise.all([
      models.FoodCategory.findAll({
        where: { categoryId: categoryIds },
      }),
      models.CustomFoodCategory.findAll({
        where: { customCategoryId: categoryIds, userId: userId },
      }),
    ])

    // 合併結果並返回
    const combinedResults = [...standardCategories, ...customCategories].map(
      (category) => category.get({ plain: true })
    )

    return res.status(200).json(combinedResults)
  } catch (error) {
    // 處理錯誤
    console.log({ error: error.message })
    return res.status(500).json({ error: "發生未知錯誤" })
  }
}

// 添加食物到黑名單
apisController.addToBlacklist = async (req, res) => {
  try {
    // 從請求參數中獲取用戶ID
    const userId = req.params.userId

    // 從請求體中獲取食物類別ID和用戶ID
    const { categoryId } = req.body

    // 驗證提供的信息
    if (!userId || !categoryId) {
      return res.status(400).json({ message: "需要用戶ID和食物類別ID。" })
    }

    const existingEntry = await models.Blacklist.findOne({
      where: { userId, categoryId },
    })
    if (existingEntry) {
      return res.status(400).json({ message: "該類別已在黑名單中。" })
    }

    // 在數據庫中創建黑名單條目
    const newBlacklistEntry = await models.Blacklist.create({
      userId,
      categoryId,
    })

    // 返回成功響應
    return res.status(201).json(newBlacklistEntry)
  } catch (error) {
    // 處理錯誤
    console.log({ error: error.message })
    return res.status(500).json({ error: "發生未知錯誤" })
  }
}

// 從黑名單中移除食物
apisController.removeFromBlacklist = async (req, res) => {
  try {
    // 從請求參數中獲取用戶ID和食物類別ID
    const userId = req.params.userId
    const categoryId = req.params.categoryId

    // 在數據庫中找到並刪除對應的黑名單條目
    const result = await models.Blacklist.destroy({
      where: {
        userId: userId,
        categoryId: categoryId,
      },
    })

    // 檢查是否有條目被刪除
    if (result === 0) {
      return res.status(404).json({ message: "黑名單條目未找到或已被刪除。" })
    }

    // 返回成功響應
    return res.status(200).json({ message: "黑名單條目已成功刪除。" })
  } catch (error) {
    // 處理錯誤
    console.log({ error: error.message })
    return res.status(500).json({ error: "發生未知錯誤" })
  }
}

// 獲取用戶的轉盤歷史
apisController.getSpinnerHistory = async (req, res) => {
  try {
    // 從請求參數中獲取用戶ID
    const userId = req.params.userId

    const page = parseInt(req.query.page) || 1 // 預設為第1頁
    const pageSize = parseInt(req.query.pageSize) || 10 // 預設每頁10條記錄

    // 計算查詢的offset
    const offset = (page - 1) * pageSize

    // 在數據庫中查找用戶的轉盤歷史
    const spinnerHistory = await models.SpinnerHistory.findAll({
      where: { userId: userId },
      limit: pageSize,
      offset: offset,
    })

    // 檢查是否找到轉盤歷史記錄
    if (spinnerHistory.length === 0) {
      return res.status(200).json({ message: "未找到轉盤歷史記錄。" })
    }

    // 返回用戶的轉盤歷史
    return res.status(200).json(spinnerHistory)
  } catch (error) {
    // 處理錯誤
    console.log({ error: error.message })
    return res.status(500).json({ error: "發生未知錯誤" })
  }
}

// 添加轉盤歷史記錄
apisController.addSpinnerHistory = async (req, res) => {
  try {
    // 從請求參數中獲取用戶ID
    const userId = req.params.userId

    // 從請求體中獲取用戶ID和選中的食物類別ID
    const { categoryName } = req.body

    // 驗證提供的信息
    if (!userId || !categoryName) {
      return res
        .status(400)
        .json({ message: "需要用戶ID和選中的食物類別名稱。" })
    }

    // 在數據庫中創建轉盤歷史記錄
    const newSpinnerHistory = await models.SpinnerHistory.create({
      userId,
      categoryName,
    })

    // 返回成功響應
    return res.status(201).json(newSpinnerHistory)
  } catch (error) {
    // 處理錯誤
    console.log({ error: error.message })
    return res.status(500).json({ error: "發生未知錯誤" })
  }
}

// 添加用戶自定義食物類別
apisController.addCustomCategory = async (req, res) => {
  try {
    // 從請求參數中獲取用戶ID
    const userId = req.params.userId

    // 從請求體中獲取用戶ID和類別名稱
    const { categoryName } = req.body

    // 驗證提供的信息
    if (!userId || !categoryName) {
      return res.status(400).json({ message: "需要用戶ID和類別名稱。" })
    }

    // 檢查是否已存在相同名稱的自定義類別
    const existingCategory = await models.CustomFoodCategory.findOne({
      where: {
        userId: userId,
        categoryName: categoryName,
      },
    })

    if (existingCategory) {
      return res.status(400).json({ message: "該類別名稱已存在。" })
    }

    // 在數據庫中創建新的自定義食物類別
    const newCustomCategory = await models.CustomFoodCategory.create({
      userId,
      categoryName,
    })

    // 返回成功響應
    return res.status(201).json(newCustomCategory)
  } catch (error) {
    // 處理錯誤
    console.log({ error: error.message })
    return res.status(500).json({ error: "發生未知錯誤" })
  }
}

// 刪除用戶自定義食物類別
apisController.deleteCustomCategory = async (req, res) => {
  try {
    const { userId, categoryId } = req.params

    // 開啟事務
    const transaction = await models.sequelize.transaction()

    try {
      // 首先刪除與該類別相關的黑名單記錄
      await models.Blacklist.destroy(
        {
          where: {
            categoryId: categoryId,
            userId: userId,
          },
        },
        { transaction }
      )

      // 刪除與該類別相關的列表關聯記錄
      await models.CategoryListRelation.destroy(
        {
          where: {
            categoryId: categoryId,
          },
        },
        { transaction }
      )

      // 刪除自定義食物類別
      const result = await models.CustomFoodCategory.destroy(
        {
          where: {
            customCategoryId: categoryId,
            userId: userId,
          },
        },
        { transaction }
      )

      if (result === 0) {
        await transaction.rollback()
        return res.status(404).json({ message: "自定義類別未找到或已被刪除。" })
      }

      // 提交事務
      await transaction.commit()

      return res
        .status(200)
        .json({ message: "自定義類別及相關記錄已成功刪除。" })
    } catch (error) {
      // 如果過程中發生錯誤，回滾事務
      await transaction.rollback()
      throw error
    }
  } catch (error) {
    // 處理錯誤
    console.log({ error: error.message })
    return res.status(500).json({ error: "發生未知錯誤" })
  }
}

// 獲取用戶的食物類別列表
apisController.getUserCategoryLists = async (req, res) => {
  try {
    // 從請求參數中獲取用戶ID
    const userId = req.params.userId

    const page = parseInt(req.query.page) || 1 // 預設為第1頁
    const pageSize = parseInt(req.query.pageSize) || 10 // 預設每頁10條記錄

    // 計算查詢的offset
    const offset = (page - 1) * pageSize

    // 在數據庫中查找與該用戶相關的食物類別列表
    const categoryLists = await models.CategoryList.findAll({
      where: { userId: userId },
      limit: pageSize,
      offset: offset,
    })

    // 檢查是否找到列表
    if (categoryLists.length === 0) {
      return res.status(404).json({ message: "未找到食物類別列表。" })
    }

    // 返回查詢到的食物類別列表
    return res.status(200).json(categoryLists)
  } catch (error) {
    // 處理錯誤
    console.error(error)
    return res.status(500).json({ error: "發生未知錯誤" })
  }
}

// 創建新的食物類別列表
apisController.createCategoryList = async (req, res) => {
  try {
    // 從請求參數中獲取用戶ID
    const userId = req.params.userId

    // 從請求體中獲取列表名稱
    const { listName } = req.body

    // 驗證提供的信息
    if (!userId || !listName) {
      return res.status(400).json({ message: "需要用戶ID和列表名稱。" })
    }

    // 檢查是否已存在相同名稱的列表
    const existingList = await models.CategoryList.findOne({
      where: {
        userId: userId,
        listName: listName,
      },
    })

    if (existingList) {
      return res.status(400).json({ message: "已存在同名的列表。" })
    }

    // 在數據庫中創建新的食物類別列表
    const newCategoryList = await models.CategoryList.create({
      userId,
      listName,
    })

    // 返回成功響應
    return res.status(201).json(newCategoryList)
  } catch (error) {
    // 處理錯誤
    console.error(error)
    return res.status(500).json({ error: "發生未知錯誤" })
  }
}

// 更新現有的食物類別列表
apisController.updateCategoryList = async (req, res) => {
  try {
    // 從請求參數中獲取用戶ID
    const userId = req.params.userId

    // 從請求參數中獲取列表ID
    const listId = req.params.listId

    // 從請求體中獲取新的列表名稱
    const { newListName } = req.body

    // 驗證提供的信息
    if (!newListName) {
      return res.status(400).json({ message: "需要提供新的列表名稱。" })
    }

    // 檢查是否已存在相同名稱的列表
    const existingList = await models.CategoryList.findOne({
      where: {
        userId: userId,
        listName: newListName,
      },
    })

    if (existingList) {
      return res.status(400).json({ message: "已存在同名的列表。" })
    }

    // 在數據庫中更新列表
    const updatedList = await models.CategoryList.update(
      { listName: newListName },
      { where: { categoryListId: listId } }
    )

    if (updatedList[0] === 0) {
      return res.status(404).json({ message: "列表未找到或未修改。" })
    }

    // 返回成功響應
    return res.status(200).json({ message: "列表已成功更新。" })
  } catch (error) {
    // 處理錯誤
    console.error(error)
    return res.status(500).json({ error: "發生未知錯誤" })
  }
}

// 查詢出屬於這個用戶且包含該食物類別的所有列表
apisController.getListsByCategoryForUser = async (req, res) => {
  try {
    const { userId, categoryId } = req.params

    // 步驟 2: 查詢出所有相關的 categoryListId
    const relations = await models.CategoryListRelation.findAll({
      where: { categoryId },
      attributes: ["categoryListId"], // 只需要 categoryListId
    })

    // 提取所有的 categoryListId
    const categoryListIds = relations.map((relation) => relation.categoryListId)

    // 步驟 3: 根據 categoryListId 和 userId 查詢出所有相關的列表
    if (categoryListIds.length > 0) {
      const lists = await models.CategoryList.findAll({
        where: {
          categoryListId: categoryListIds,
          userId, // 確保列表屬於該用戶
        },
        attributes: ["categoryListId", "listName"], // 只需要列出 listName 和 categoryListId
      })

      // 返回查詢結果
      return res.status(200).json(lists)
    } else {
      // 如果沒有找到相關的 categoryListId，返回空數組
      return res.status(404).json({ message: "未找到相關的列表。" })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "查詢過程中發生錯誤。" })
  }
}

// 刪除食物類別列表
apisController.deleteCategoryList = async (req, res) => {
  try {
    // 從請求參數中獲取列表ID
    const listId = req.params.listId

    // 從請求參數中獲取用戶ID
    const userId = req.params.userId

    // 開啟事務
    const transaction = await models.sequelize.transaction()

    try {
      // 首先刪除與該列表相關的列表關聯記錄
      await models.CategoryListRelation.destroy(
        { where: { categoryListId: listId } },
        { transaction }
      )
      // 然後刪除列表本身
      const result = await models.CategoryList.destroy({
        where: {
          categoryListId: listId,
          userId: userId,
        },
        transaction: transaction,
      })

      if (result === 0) {
        await transaction.rollback()
        return res.status(404).json({ message: "列表未找到或已被刪除。" })
      }

      // 提交事務
      await transaction.commit()
      return res.status(200).json({ message: "列表已成功刪除。" })
    } catch (error) {
      // 如果過程中發生錯誤，回滾事務
      await transaction.rollback()
      throw error
    }
  } catch (error) {
    // 處理錯誤
    console.error(error)
    return res.status(500).json({ error: "發生未知錯誤" })
  }
}

// 為特定列表添加食物類別
apisController.addCategoryToList = async (req, res) => {
  try {
    // 從請求參數中獲取列表ID
    const listId = req.params.listId

    // 從請求體中獲取食物類別ID
    const { categoryId } = req.body

    // 驗證提供的信息
    if (!categoryId) {
      return res.status(400).json({ message: "需要提供食物類別ID。" })
    }

    // 檢查是否已存在相同的類別關聯
    const existingRelation = await models.CategoryListRelation.findOne({
      where: {
        categoryListId: listId,
        categoryId: categoryId,
      },
    })

    if (existingRelation) {
      return res.status(400).json({ message: "該列表中已存在此類別。" })
    }

    // 在數據庫中創建新的關聯記錄
    const newRelation = await models.CategoryListRelation.create({
      categoryListId: listId,
      categoryId,
    })

    // 返回成功響應
    return res.status(201).json(newRelation)
  } catch (error) {
    // 處理錯誤
    console.error(error)
    return res.status(500).json({ error: "發生未知錯誤" })
  }
}

// 從列表中移除食物類別
apisController.removeCategoryFromList = async (req, res) => {
  try {
    // 從請求參數中獲取列表ID和食物類別ID
    const listId = req.params.listId
    const categoryId = req.params.categoryId

    // 在數據庫中刪除對應的關聯記錄
    const result = await models.CategoryListRelation.destroy({
      where: {
        categoryListId: listId,
        categoryId: categoryId,
      },
    })

    if (result === 0) {
      return res.status(404).json({ message: "未找到相關的列表或類別。" })
    }

    // 返回成功響應
    return res.status(200).json({ message: "類別已從列表中移除。" })
  } catch (error) {
    // 處理錯誤
    console.error(error)
    return res.status(500).json({ error: "發生未知錯誤" })
  }
}

// 獲取列表中的所有食物類別
apisController.getListCategories = async (req, res) => {
  try {
    const listId = req.params.listId
    const userId = req.params.userId

    // 先查找與該列表相關的所有類別ID
    const relations = await models.CategoryListRelation.findAll({
      where: { categoryListId: listId },
      attributes: ["categoryId"],
    })
    const categoryIds = relations.map((relation) => relation.categoryId)

    // 查找黑名單中的類別ID
    const blacklisted = await models.Blacklist.findAll({
      where: { userId },
      attributes: ["categoryId"],
    })
    const blacklistedIds = blacklisted.map((item) => item.categoryId)

    // 查找所有類別（標準+自定義）並標記黑名單和自定義
    const categories = await Promise.all([
      models.FoodCategory.findAll({
        where: { categoryId: categoryIds },
        attributes: ["categoryId", "categoryName"],
      }),
      models.CustomFoodCategory.findAll({
        where: { customCategoryId: categoryIds, userId },
        attributes: [["customCategoryId", "categoryId"], "categoryName"],
      }),
    ])

    // 合併並處理類別
    const combinedCategories = categories.flat().map((category) => ({
      ...category.get({ plain: true }),
      isBlacklisted: blacklistedIds.includes(category.categoryId),
      isCustom: category instanceof models.CustomFoodCategory, // 直接根據實例類型判斷是否為自定義
    }))

    return res.status(200).json(combinedCategories)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "發生未知錯誤" })
  }
}

module.exports = apisController
