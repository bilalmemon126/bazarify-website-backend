import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../models/user.model.js'
import { Chat } from '../../models/chat.model.js'
const router = express.Router()

router.get('/notifications/:userId', async (req, res) => {
    try {
        let userId = new ObjectId(req.params.userId)
        let checkUser = await User.findOne({ _id: userId })

        if (!checkUser) {
            return res.status(400).send({
                status: 0,
                message: "user not found",
                data: []
            })
        }

        let getAllNotifications = await Chat.find(
            {
                $or: [
                    { buyerId: userId },
                    { sellerId: userId }
                ],
                senderId: { $ne: userId }
            },
            { roomId: 1, _id: 0 }
        )

        if (!getAllNotifications.length) {
            return res.status(400).send({
                status: 0,
                message: "something went wrong",
                data: []
            })
        }

        console.log(getAllNotifications)
        return res.status(200).send(
            {
                status: 1,
                message: "all notifications fetched successfully",
                data: getAllNotifications
            }
        )
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