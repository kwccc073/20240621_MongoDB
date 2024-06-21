import Product from '../models/product.js'
import { StatusCodes } from 'http-status-codes'

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

export const getAll = async (req, res) => {
  try {
    console.log(req.query)

    // price >= 500 && category === '音樂
    // const result = await Product.find({
    //   category: '音樂',
    //   price: { $gte: 500 }
    // })

    // 名稱是否有 Phone 不分大小寫
    // const result = await Product.find({
    //   name: /Phone/i
    // })

    // .sort({ 欄位: 值 })
    // 1 = 正序
    // -1 = 倒序

    // .limit(限制回傳資料數)
    // .skip(跳過筆數)
    // const result = await Product.find().sort({ price: -1 }).limit(2).skip(2)

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
