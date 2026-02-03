import express from 'express'
import { ObjectId } from 'mongodb'
import cloudinary from '../../config/cloudinary.js'
import { Product } from '../../models/product.model.js'
import { User } from '../../models/user.model.js'
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
                if (deleteProduct) {
                    return res.send({
                        status: 1,
                        message: "Product Deleted Successfully"
                    })
                }
                else {
                    return res.send({
                        status: 0,
                        message: "Something Went Wrong"
                    })
                }
            }
            else {
                return res.send({
                    status: 0,
                    message: "Product Not Found"
                })
            }
        }
        else {
            return res.send({
                status: 0,
                message: "something went wrong"
            })
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