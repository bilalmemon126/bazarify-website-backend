import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../models/user.model.js'
import { Product } from '../../models/product.model.js'
import { Favourite } from '../../models/favourite.model.js'

const router = express.Router()

router.post('/favourite/:productId/:userId', async (req, res) => {
    try {
        let productId = new ObjectId(req.params.productId)
        let userId = new ObjectId(req.params.userId)
        let checkUser = await User.findOne({ _id: userId })
        let findProducts = await Product.findOne({ _id: productId })

        if (!checkUser) {
            return res.status(400).send({
                status: 0,
                message: "something went wrong"
            })
        }
        if (!findProducts) {
            return res.status(400).send({
                status: 0,
                message: "Product Not Found"
            })
        }

        let findFavourite = await Favourite.findOne({ userId, productId })

        if (!findFavourite) {
            let addFavourite = await Favourite.insertOne({ userId, productId })

            if (addFavourite) {
                return res.status(200).send({
                    status: 1,
                    message: "product added to favourite successfully"
                })
            }
        }
        let removeFavourite = await Favourite.deleteOne({ _id: findFavourite._id })

        if (removeFavourite) {
            return res.send({
                status: 1,
                message: "removed from favourite successfully"
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