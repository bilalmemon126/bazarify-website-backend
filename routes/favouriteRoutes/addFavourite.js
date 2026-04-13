import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../models/user.model.js'
import { Product } from '../../models/product.model.js'
import { Favourite } from '../../models/favourite.model.js'
import { errorMessage, successMessage } from '../../utils/responseMessage.js'

const router = express.Router()

router.post('/:productId/:userId', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.productId) || !ObjectId.isValid(req.params.userId)) {
            return errorMessage(res, 400, "Invalid ID format", [])
        }

        let productId = new ObjectId(req.params.productId)
        let userId = new ObjectId(req.params.userId)
        let checkUser = await User.exists({ _id: userId })
        let findProducts = await Product.exists({ _id: productId })

        if (!checkUser) {
            return errorMessage(res, 400, "Something Went Wrong", [])
        }
        if (!findProducts) {
            return errorMessage(res, 404, "product not found", [])
        }

        let findFavourite = await Favourite.exists({ userId, productId })

        if (!findFavourite) {
            let addFavourite = await Favourite.create({ userId, productId })

            if (addFavourite) {
                return successMessage(res, "product added to favourite successfully", [])
            }
        }
        let removeFavourite = await Favourite.deleteOne({ _id: findFavourite._id })

        if (removeFavourite.deletedCount === 1) {
            return successMessage(res, "product removed from favourite successfully", [])
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