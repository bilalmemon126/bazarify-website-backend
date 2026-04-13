import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../../models/user.model.js'
import { Product } from '../../../models/product.model.js'
import { errorMessage, successMessage } from '../../../utils/responseMessage.js'
const router = express.Router()

router.put('/product/:productId/:adminId', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.productId) || !ObjectId.isValid(req.params.adminId)) {
            return errorMessage(res, 400, "Invalid ID format", [])
        }

        let productId = new ObjectId(req.params.productId)
        let adminId = new ObjectId(req.params.adminId)
        let checkAdmin = await User.findOne({ _id: adminId })
        let findProduct = await Product.findOne({ _id: productId })

        if (!checkAdmin) {
            return errorMessage(res, 404, "Admin Not Found", [])
        }

        if (!checkAdmin.isAdmin) {
            return errorMessage(res, 403, "Only admin can update this product", [])
        }

        if (!findProduct) {
            return errorMessage(res, 404, "Product Not Found", [])
        }

        let updateProduct = await Product.updateOne(
            { _id: productId },
            { $set: { isBlocked: !findProduct.isBlocked } }
        )

        if (!updateProduct) {
            return errorMessage(res, 500, "Something Went Wrong", [])
        }

        return successMessage(res, "Product updated successfully", [])
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