const { Memo } = require("../models") // 引入模型

const apisController = {
  getAllMemos: async (req, res) => {
    try {
      const memos = await Memo.findAll()
      res.json(memos)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  getMemo: async (req, res) => {
    try {
      const memo = await Memo.findByPk(req.params.id)
      if (memo) {
        res.json(memo)
      } else {
        res.status(404).json({ error: "Memo not found" })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  createMemo: async (req, res) => {
    try {
      const memo = await Memo.create(req.body)
      res.status(201).json(memo)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  updateMemo: async (req, res) => {
    try {
      const memo = await Memo.findByPk(req.params.id)
      if (memo) {
        await memo.update(req.body)
        res.json(memo)
      } else {
        res.status(404).json({ error: "Memo not found" })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  deleteMemo: async (req, res) => {
    try {
      const memo = await Memo.findByPk(req.params.id)
      if (memo) {
        await memo.destroy()
        res.json({ message: "Memo successfully deleted" })
      } else {
        res.status(404).json({ error: "Memo not found" })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

module.exports = apisController
