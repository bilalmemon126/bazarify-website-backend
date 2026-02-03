import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../models/user.model.js'
import { Favourite } from '../../models/favourite.model.js'
import { Product } from '../../models/product.model.js'

const router = express.Router()

router.get('/favourite/:userId', async (req, res) => {
    try {
        let userId = new ObjectId(req.params.userId)
        let checkUser = await User.findOne({ _id: userId })
        if (checkUser) {
            let checkFavourite = await Favourite.find({ userId })
            if (checkFavourite) {
                let favouriteProductId = checkFavourite.map((v, i) => v.productId)

                let findFavouriteProducts = await Product.find({ _id: { $in: favouriteProductId } })

                if (findFavouriteProducts) {
                    return res.status(200).send({
                        status: 1,
                        message: "get all favourite products successfully",
                        data: findFavouriteProducts
                    })
                }
            }
            else {
                return res.status(200).send({
                    status: 1,
                    message: "No favourite products found",
                    data: []
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
            message: "Internal Server Error"
        })
    }
})

export default router