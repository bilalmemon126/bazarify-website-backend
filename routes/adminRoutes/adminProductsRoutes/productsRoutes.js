import express from 'express'
import adminGetProductsRoute from './getProducts.js'
import adminEditProductsRoute from './editProducts.js'

const router = express.Router()

router.use(adminGetProductsRoute)
router.use(adminEditProductsRoute)

export default router