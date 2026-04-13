import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../models/user.model.js'
import { ChatNotification } from '../../models/chatNotification.model.js'
import { errorMessage, successMessage } from '../../utils/responseMessage.js'
const router = express.Router()

router.get('/notifications/:userId', async (req, res) => {
    try {
        let userId = new ObjectId(req.params.userId)
        let checkUser = await User.findOne({ _id: userId })

        if (!checkUser) {
            
            return errorMessage(res, 404, "user not found", [])
        }

        let getAllNotifications = await ChatNotification.find({receiverId: userId})

        if (!getAllNotifications.length) {
            return errorMessage(res, 404, "notifications not available", [])
        }

        
        return successMessage(res, "all notifications fetched successfully", getAllNotifications)
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