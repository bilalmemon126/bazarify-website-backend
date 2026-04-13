import express from 'express'
import { User } from '../../models/user.model.js'
import { Product } from '../../models/product.model.js'
import { Chat } from '../../models/chat.model.js'
import { errorMessage, successMessage } from '../../utils/responseMessage.js'
const router = express.Router()

router.post("/send", async (req, res) => {
    try {
        let checkBuyer = await User.findOne({ _id: req.body.buyerId })
        let checkSeller = await User.findOne({ _id: req.body.sellerId })
        let findProduct = await Product.findOne({ _id: req.body.productId })

        if (!checkBuyer) {
            return errorMessage(res, 404, "user not found", [])
        }

        if (!checkSeller) {
            return errorMessage(res, 404, "user not found", [])
        }

        if (!findProduct) {
            return errorMessage(res, 404, "product not found", [])
        }
        let data = {
            buyerId: req.body.buyerId,
            sellerId: req.body.sellerId,
            productId: req.body.productId,
            message: req.body.message,
            senderId: req.body.senderId,
            roomId: req.body.roomId
        }

        let insert = await Chat.insertOne(data)

        if (!insert) {
            return errorMessage(res, 400, "Something Went Wrong", [])
        }
        
        return successMessage(res, "chat created successfully", insert._id)
    }
    catch (error) {
        return res.status(400).send({
            status: 0,
            error: error,
            message: "Internal Server Errooor"
        })
    }
})


export default router