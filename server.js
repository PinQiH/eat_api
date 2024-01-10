require("dotenv").config()

const express = require("express")
const app = express()
const port = process.env.PORT || 3000
const apiRoutes = require("./routes/api")

app.use(express.json())

app.get("/", (req, res) => {
  res.send("備忘錄 API 正在運行")
})

app.use("/api", apiRoutes)

app.listen(port, () => {
  console.log(`伺服器正在運行於 http://localhost:${port}`)
})
