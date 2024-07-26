import { Schema, model, Error, ObjectId } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt' // 用於加密

// 購物車資料--------------------------------------------------------------
const cartSchema = new Schema({
  // 什麼商品
  p_id: {
    type: ObjectId, // ObjectId指的是mongoDB裡的_id
    // 表示 _id 的來源是 proucts collection（MogoDB裡的proucts資料夾）
    ref: 'products',
    required: [true, '使用者購物車商品 ID 必填']
  },
  // 數量
  quantity: {
    type: Number,
    required: [true, '使用者購物車商品數量必填'],
    min: [1, '使用者購物車商品數量不能小於 1']
  }
})

// 使用者資料--------------------------------------------------------------
const schema = new Schema({
  email: {
    type: String,
    required: [true, '使用者信箱必填'],
    unique: true, // 不得重複
    validate: {
      validator (value) {
        // 引入套件的驗證方法
        return validator.isEmail(value)
      },
      message: '使用者信箱格式錯誤'
    }
  },
  password: {
    type: String,
    required: [true, '使用者密碼必填']
    // 資料庫要存的是加密後的密碼，因此密碼的格式驗證不會寫在這裡
  },
  cart: {
    // 陣列裡面的東西是上方cartSchema的東西（是{}）
    type: [cartSchema]
  }
}, {
  versionKey: false, // 關閉檔案修改幾次的紀錄(__v)
  timestamps: true // 紀錄使用者建立的時間
})

// 資料驗證完後，寫入資料庫前
schema.pre('save', function (next) {
  // this 代表將要被保存的資料，不能用箭頭函式
  const user = this
  // 如果密碼欄位有被修改
  if (user.isModified('password')) {
    // 驗證密碼格式
    if (user.password.length >= 4 && user.password.length <= 20) {
      // 驗證成功就加密
      user.password = bcrypt.hashSync(user.password, 10) // 加密套件的寫法
    } else {
      // 驗證失敗，手動產生一個 mongoose 驗證錯誤
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度不正確' }))
      // 繼續下一步，帶出錯誤給錯誤處理軟體
      next(error)
      return // 後面的不執行
    }
  }
  // 繼續下一步，一定要寫next()
  next()
})

export default model('users', schema)
