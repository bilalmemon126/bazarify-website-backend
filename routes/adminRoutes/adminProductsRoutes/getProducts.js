import express from 'express'
import { Product } from '../../../models/product.model.js'
import { errorMessage, successMessage } from '../../../utils/responseMessage.js'
const router = express.Router()

router.get('/product', async (req, res) => {
    try {
        let findProducts = await Product.find()

        if (!findProducts.length) {
            return errorMessage(res, 404, "Product Not Found", [])
        }

        return successMessage(res, "fetch all products successfully", findProducts)
    }
    catch (error) {
        return res.status(400).send({
            status: 0,
            error: error,
            message: "Internal Server Error"
        })
    }
})

export default router