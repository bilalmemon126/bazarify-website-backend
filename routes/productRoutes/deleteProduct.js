import express from 'express'
import { ObjectId } from 'mongodb'
import cloudinary from '../../config/cloudinary.js'
import { Product } from '../../models/product.model.js'
import { User } from '../../models/user.model.js'
import { errorMessage, successMessage } from '../../utils/responseMessage.js'
const router = express.Router()


router.delete('/product/:productId/:userId', async (req, res) => {
    try {
        let productId = new ObjectId(req.params.productId)

        let userId = new ObjectId(req.params.userId)

        let findProduct = await Product.findOne({ _id: productId })
        let checkUser = await User.findOne({ _id: userId })
        if (checkUser) {
            if (findProduct) {
                cloudinary.uploader.destroy(findProduct.mainImage.public_id)
                .then(result => {
                    return result
                })

                findProduct.images.map((v, i) => {
                    return cloudinary.uploader.destroy(v.public_id)
                    .then(result => {
                        return result
                    })
                })

                let deleteProduct = await Product.deleteOne({_id: productId})
                if (!deleteProduct) {
                    return errorMessage(res, 400, "Something Went Wrong", [])
                }
                return successMessage(res, "product deleted successfully", [])
            }
            else {
                return errorMessage(res, 404, "Product Not Found", [])
            }
        }
        else {
            return errorMessage(res, 400, "Something Went Wrong", [])
        }
    }
    catch (error) {
        return res.status(400).send({
            status: 0,
            error: error,
            message: "Internal Server Errorrrr"
        })
    }
})

export default router