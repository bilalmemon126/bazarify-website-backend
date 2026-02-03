import express from 'express'
import addCategory from './addCategory.js'
import editCategory from './editCategory.js'
import deleteCategory from './deleteCategory.js'

const router = express.Router()

router.use(addCategory)
router.use(editCategory)
router.use(deleteCategory)

export default router