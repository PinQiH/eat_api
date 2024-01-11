require("dotenv").config() // 這將讀取 `.env` 檔案並將環境變數加載到 process.env 中

module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME || "database_development",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres", // 確保這裡是 'postgres'
    port: process.env.DB_PORT || 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // 只有當您無法控制 CA 或在本地測試時才設置為 false
      },
    },
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME || "database_test",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres", // 確保這裡是 'postgres'
    port: process.env.DB_PORT || 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // 只有當您無法控制 CA 或在本地測試時才設置為 false
      },
    },
  },
  production: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME || "database_production",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres", // 確保這裡是 'postgres'
    port: process.env.DB_PORT || 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // 只有當您無法控制 CA 或在本地測試時才設置為 false
      },
    },
  },
}
