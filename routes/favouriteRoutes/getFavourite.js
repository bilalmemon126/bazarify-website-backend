import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../models/user.model.js'
import { Favourite } from '../../models/favourite.model.js'
import { errorMessage, successMessage } from '../../utils/responseMessage.js'

const router = express.Router()

router.get('/:userId', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.userId)) {
            return errorMessage(res, 400, "Invalid ID format", [])
        }
        let userId = new ObjectId(req.params.userId)
        let checkUser = await User.exists({ _id: userId })

        if (!checkUser) {
            return errorMessage(res, 400, "Something Went Wrong", [])
        }

        let favourites = await Favourite.find({ userId })
        .populate("productId")

        if (!favourites.length) {
            return errorMessage(res, 404, "favourite products not found", [])
        }

        
        return successMessage(res, "all favourite products fetched successfully", favourites)
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