import User from '../models/user.js'
import Product from '../models/product.js'
import { StatusCodes } from 'http-status-codes'
import validator from 'validator'

export const create = async (req, res) => {
  try {
    const result = await User.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: '帳號或信箱重複'
      })
    } else if (error.name === 'ValidationError') {
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

export const addCart = async (req, res) => {
  try {
    // 檢查網址路徑的使用者 ID
    if (!validator.isMongoId(req.params.uid)) throw new Error('USER ID')
    // 檢查 body 內的商品 ID
    if (!validator.isMongoId(req.body.product)) throw new Error('PRODUCT ID')

    // 檢查商品是否存在
    // const product = await Product.findById(req.body.product)
    // if (!product) throw new Error('PRODUCT NOT FOUND')
    await Product.findById(req.body.product).orFail(new Error('PRODUCT NOT FOUND'))

    // 取出使用者資料
    const user = await User.findById(req.params.uid).orFail(new Error('USER NOT FOUND'))

    // 檢查商品是否在購物車
    const idx = user.cart.findIndex(item => item.p_id.toString() === req.body.product)
    if (idx > -1) {
      // 在購物車，修改數量
      user.cart[idx].quantity = req.body.quantity
    } else {
      // 不在購物車，新增
      user.cart.push({
        p_id: req.body.product,
        quantity: req.body.quantity
      })
    }

    // 保存
    await user.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'CastError' || error.message === 'PRODUCT ID' || error.message === 'USER ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'ID 格式錯誤'
      })
    } else if (error.message === 'PRODUCT NOT FOUND' || error.message === 'USER NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無使用者或商品'
      })
    } else if (error.name === 'ValidationError') {
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

export const getId = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.uid)) throw new Error('USER ID')

    // 'email password' ---> 只取 email 和 passsword
    // '-password'      ---> 除了 password 以外的
    // .populate(有外部資料的欄位)
    const result = await User
      .findById(req.params.uid, '-password')
      .populate('cart.p_id', 'name price')
      .orFail(new Error('USER NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    if (error.name === 'CastError' || error.message === 'USER ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'ID 格式錯誤'
      })
    } else if (error.message === 'USER NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無使用者或商品'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}
