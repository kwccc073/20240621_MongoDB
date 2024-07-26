import 'dotenv/config'
import mongoose from 'mongoose'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
// 引入routes中的檔案
import routeUser from './routes/user.js'
import routeProduct from './routes/product.js'

// 建立express伺服器
const app = express()

app.use(express.json()) // 把請求的資料解析成json
// 解析時有可能錯誤，因此要寫錯誤處理的function
// _原本是error，但這裡有錯誤也不能處理所以寫_
app.use((_, req, res, next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: '資料格式錯誤'
  })
})

// index.js中請求太多會很雜很亂，因此可建立用路由來進行分類
// 所有進到 /user 路徑的請求都交給 routeUser 處理
// 最終路徑為http://localhost:4000/user/routeUser裡的路徑
app.use('/user', routeUser)
app.use('/product', routeProduct)

// 監聽指定環境變數的PORT，如果沒有process.env.PORT就使用4000
app.listen(process.env.PORT || 4000, async () => {
  console.log('伺服器啟動')
  // 啟動後再連線mongoose的資料庫
  await mongoose.connect(process.env.DB_URL)
  console.log('資料庫連線成功')
})
