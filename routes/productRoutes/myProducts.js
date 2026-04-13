import express from 'express'
import { ObjectId } from 'mongodb'
import { Product } from '../../models/product.model.js'
import { errorMessage, successMessage } from '../../utils/responseMessage.js'
const router = express.Router()


router.get('/myproducts/:userId', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.userId)) {
            return errorMessage(res, 400, "Invalid ID format", [])
        }

        let filter = {createdBy: req.params.userId}
        let sort = { createdAt: -1 }

        if (req.query.search) {
            filter.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ]
        }

        let findProducts = await Product.find(filter)
            .sort(sort)
            .populate("category createdBy location")

        if (findProducts.length === 0) {
            return errorMessage(res, 404, "Product Not Found", [])
        }

        return successMessage(res, "all products fetched successfully", findProducts)
    }
    catch (error) {
        return res.status(500).send({
            status: 0,
            error: error,
            message: "Internal Server Error"
        })
    }
})

export default router