import { Router } from 'express' // 用於定義路由
import { create, addCart, getId } from '../controllers/user.js' // 引入各種function

const router = new Router()

// router.請求('路由', 要執行的function)
// 要執行的function來自controllers裡的檔案
router.post('/', create)
// 用uid去取得資料
// uid => 代指使用者的id
router.post('/:uid/cart', addCart) // 對某個使用者的購物車作post請求
router.get('/:uid', getId)

export default router
