import express from 'express'
import { ObjectId } from 'mongodb'
import { Product } from '../../models/product.model.js'
import { User } from '../../models/user.model.js'
import { Chat } from '../../models/chat.model.js'
const router = express.Router()

router.get('/chat/:productId/:userId', async (req, res) => {
    try {
        let productId = new ObjectId(req.params.productId)
        let userId = new ObjectId(req.params.userId)

        let checkProduct = await Product.findOne({ _id: productId })
        let checkUser = await User.findOne({ _id: userId })

        if (!checkProduct) {
            return res.status(400).send({
                status: 0,
                message: "product not found",
                chats: []
            })
        }

        if (!checkUser) {
            return res.status(400).send({
                status: 0,
                message: "user not found",
                chats: []
            })
        }

        let getAllChats = await Chat.find({
            productId: productId,
            $or: [
                { buyerId: userId },
                { sellerId: userId }
            ]
        })

        if (!getAllChats) {
            return res.status(400).send({
                status: 0,
                message: "something went wrong",
                chats: []
            })
        }

        return res.status(200).send({
            status: 1,
            message: "all chats fetched successfully",
            chats: getAllChats
        })
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