import Product from '../models/product.js'
import { StatusCodes } from 'http-status-codes'

// 建立商品------------------------------------------------
export const create = async (req, res) => {
  try {
    const result = await Product.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message

      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}

// 取得全部商品------------------------------------------------
// 預設會照建立的順序回傳
// 可用query來作條件的過濾
export const getAll = async (req, res) => {
  try {
    console.log(req.query)

    /* 找到 price >= 500 && category === '音樂的項目
       const result = await Product.find({
         category: '音樂',
         price: { $gte: 500 } // gte表示>=
       }) */

    /* 找到名稱有Phone(不分大小寫)的項目
       const result = await Product.find({
         name: /Phone/i // 正則表達式： 用//包住正則表達式，i表示不分大小寫
       }) */

    // .sort({ 用來排序的欄位: 值 }) **值：1 => 正序、-1 => 倒序(大到小)
    // 需要分頁顯示會用到：.limit(限制回傳資料數量).skip(跳過筆數)
    // const result = await Product.find().sort({ price: -1 }).limit(2).skip(2)

    // .sort({ 用來排序的欄位: 值 })
    // 把變數的值當作物件的key，需要加[]，例如下方[req.query.sortBy || '_id']
    const result = await Product.find().sort({ [req.query.sortBy || '_id']: req.query.sort * 1 || 1 })

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}
