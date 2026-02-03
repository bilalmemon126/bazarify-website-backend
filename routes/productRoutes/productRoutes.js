import express from 'express'
import addProductRoute from './addProduct.js'
import getProductRoute from './getProduct.js'
import getHomeProductRoute from './getHomeProduct.js'
import getProductDetailsRoute from './getProductDetails.js'
import deleteProductRoute from './deleteProduct.js'
import editProductRoute from './editProduct.js'
const router = express.Router()

router.use(addProductRoute)
router.use(getProductRoute)
router.use(getHomeProductRoute)
router.use(getProductDetailsRoute)
router.use(deleteProductRoute)
router.use(editProductRoute)

export default router