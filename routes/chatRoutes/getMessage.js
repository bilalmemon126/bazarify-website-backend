import express from 'express'
import { ObjectId } from 'mongodb'
import { Product } from '../../models/product.model.js'
import { User } from '../../models/user.model.js'
import { Chat } from '../../models/chat.model.js'
import { errorMessage, successMessage } from '../../utils/responseMessage.js'
const router = express.Router()

router.post('/:productId/:userId', async (req, res) => {
    try {
        let productId = new ObjectId(req.params.productId)
        let userId = new ObjectId(req.params.userId)

        let checkProduct = await Product.findOne({ _id: productId })
        let checkUser = await User.findOne({ _id: userId })

        if (!checkProduct) {
            return errorMessage(res, 404, "product not found", [])
        }

        if (!checkUser) {
            return errorMessage(res, 404, "user not found", [])
        }

        let getAllChats = await Chat.find({
            roomId: req.body.roomId
        })

        if (!getAllChats.length) {
            return errorMessage(res, 400, "Something Went Wrong", [])
        }

        
        return successMessage(res, "all chats fetched successfully", getAllChats)
    }
    catch (error) {
        return res.status(400).send({
            status: 0,
            error: error,
            message: "Internal Server Errowoqor"
        })
    }
})

export default router