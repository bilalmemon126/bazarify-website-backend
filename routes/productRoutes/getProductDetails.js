import express from 'express'
import { Product } from '../../models/product.model.js'
import { ObjectId } from 'mongodb'
const router = express.Router()


router.get('/product/:productId', async (req, res) => {
    try {
        let productId = new ObjectId(req.params.productId)

        let findProduct = await Product.findOne({_id: productId})
        .populate("category createdBy location")

        if (!findProduct) {
            return res.send({
                status: 0,
                message: "Product Not Found",
                data: []
            })
        }

        return res.send({
            status: 1,
            message: "products fetched successfully",
            data: findProduct
        })
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