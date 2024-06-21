import { Schema, model, Error, ObjectId } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const cartSchema = new Schema({
  p_id: {
    type: ObjectId,
    // ID 的來源是 proucts collection
    ref: 'products',
    required: [true, '使用者購物車商品 ID 必填']
  },
  quantity: {
    type: Number,
    required: [true, '使用者購物車商品數量必填'],
    min: [1, '使用者購物車商品數量不能小於 1']
  }
})

const schema = new Schema({
  email: {
    type: String,
    required: [true, '使用者信箱必填'],
    unique: true,
    validate: {
      validator (value) {
        return validator.isEmail(value)
      },
      message: '使用者信箱格式錯誤'
    }
  },
  password: {
    type: String,
    required: [true, '使用者密碼必填']
  },
  cart: {
    type: [cartSchema]
  }
}, { versionKey: false, timestamps: true })

// 資料驗證完後，寫入資料庫前
schema.pre('save', function (next) {
  // this 代表將要被保存的資料
  const user = this
  // 如果密碼欄位有被修改
  if (user.isModified('password')) {
    // 驗證密碼格式
    if (user.password.length >= 4 && user.password.length <= 20) {
      // 驗證成功就加密
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      // 驗證失敗，手動產生一個 mongoose 驗證錯誤
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度不正確' }))
      // 繼續下一步，帶出錯誤
      next(error)
      return
    }
  }
  // 繼續下一步
  next()
})

export default model('users', schema)
