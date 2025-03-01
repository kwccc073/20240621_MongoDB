import 'dotenv/config'
import mongoose from 'mongoose'
import express from 'express'
import { StatusCodes } from 'http-status-codes' // 引入狀態碼
// 引入routes中的檔案
import routeUser from './routes/user.js'
import routeProduct from './routes/product.js'

// express- 1. 建立express伺服器
const app = express()

// express- 3. 把各種請求的body解析成JSON
// express.json() => 把post、patch等請求的body解析成json
app.use(express.json())
// 但解析時有可能錯誤，因此要寫錯誤處理的function
// Middleware是指在處理 HTTP 請求和回應過程中，介於請求進來和回應發送出去之間的一段程式碼，除了req、res還多了next。
// 如果要處理錯誤還會有參數error，但這裡有錯誤也不能處理所以寫_以忽略error
app.use((_, req, res, next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: '資料格式錯誤'
  })
})

// express- 4. 引入路由------------------------------------------------
// index.js中請求太多會很雜很亂，因此可建立用路由來進行分類

// User相關請求
// 所有進到 /user 路徑的請求都交給 routeUser 處理
// 最終路徑為http://localhost:4000/user/routeUser裡各種請求對應的路徑
app.use('/user', routeUser)
// Product相關請求
app.use('/product', routeProduct)

// express- 2. 監聽指定環境變數的PORT，如果沒有process.env.PORT就使用4000
app.listen(process.env.PORT || 4000, async () => {
  console.log('伺服器啟動')
  // 啟動後再連線mongoose的資料庫
  await mongoose.connect(process.env.DB_URL)
  console.log('資料庫連線成功')
})
