import express from 'express'
import { Product } from '../../../models/product.model.js'
const router = express.Router()

router.get('/product', async (req, res) => {
    try {
        let findProducts = await Product.find()
        if (findProducts.length > 0) {
            return res.status(200).send({
                status: 1,
                message: "fetch all products successfully",
                data: findProducts
            })
        }
        else {
            return res.status(400).send({
                status: 0,
                message: "Product Not Found",
                data: []
            })
        }
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