import { Router } from 'express'
import { create, addCart, getId } from '../controllers/user.js'

const router = new Router()

router.post('/', create)
// uid 表示使用者的id
router.post('/:uid/cart', addCart)
router.get('/:uid', getId)

export default router
