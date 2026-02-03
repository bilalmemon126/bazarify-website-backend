import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../../models/user.model.js'
import { Product } from '../../../models/product.model.js'
const router = express.Router()

router.put('/product/:productId/:adminId', async (req, res) => {
    try {
        let productId = new ObjectId(req.params.productId)
        let adminId = new ObjectId(req.params.adminId)
        let checkUser = await User.findOne({ _id: adminId })
        let findProducts = await Product.findOne({ _id: productId })

        
        if (!checkUser) {
            return res.status(400).send({
                status: 0,
                message: "only admin can access this route",
                data: ""
            })
        }

        if(!checkUser.isAdmin){
            return res.status(400).send({
                status: 0,
                message: "only admin can update this product",
                data: ""
            })
        }

        if (!findProducts) {
            return res.send({
                status: 0,
                message: "Product Not Found",
                data: ""
            })
        }

        let updateProduct = await Product.updateOne(
            {_id: productId},
            {$set: {isBlocked: !findProducts.isBlocked}},
            {}
        )

        if (updateProduct) {
            return res.send({
                status: 1,
                message: "Product updated Successfully",
                data: updateProduct
            })
        }
        else {
            return res.send({
                status: 0,
                message: "Something Went Wrong",
                data: ""
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