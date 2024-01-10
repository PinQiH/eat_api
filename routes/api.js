const express = require("express")
const router = express.Router()
const apisController = require("../controllers/apisController")

router.get("/memos", apisController.getAllMemos)
router.get("/memos/:id", apisController.getMemo)
router.post("/memos", apisController.createMemo)
router.put("/memos/:id", apisController.updateMemo)
router.delete("/memos/:id", apisController.deleteMemo)

module.exports = router
