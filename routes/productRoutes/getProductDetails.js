import express from 'express'
import { Product } from '../../models/product.model.js'
import { ObjectId } from 'mongodb'
import { errorMessage, successMessage } from '../../utils/responseMessage.js'
const router = express.Router()


router.get('/product/:productId', async (req, res) => {
    try {
        console.log("product details route")
        let productId = new ObjectId(req.params.productId)

        let findProduct = await Product.findOne({_id: productId})
        .populate("category createdBy location")

        if (!findProduct) {
            return errorMessage(res, 404, "Product Not Found", [])
        }

        return successMessage(res, "product fetched successfully", findProduct)
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