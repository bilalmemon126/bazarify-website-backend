import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../models/user.model.js'
import { ChatNotification } from '../../models/chatNotification.model.js'
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

        let getAllNotifications = await ChatNotification.find({receiverId: userId})

        if (!getAllNotifications.length) {
            return res.status(400).send({
                status: 0,
                message: "no notifications available",
                data: []
            })
        }

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