import express from 'express'
import { ObjectId } from 'mongodb'
import { ChatNotification } from '../../models/chatNotification.model.js'
import { User } from '../../models/user.model.js'
import { errorMessage, successMessage } from '../../utils/responseMessage.js'
const router = express.Router()

router.post('/notifications/:userId', async (req, res) => {
    try {
        let userId = new ObjectId(req.params.userId)
        let checkUser = await User.findOne({_id: userId})

        if (!checkUser) {
            return errorMessage(res, 404, "user not found", [])
        }

        let {senderId, receiverId, chatRoomId} = req.body

        if(!senderId || !receiverId || !chatRoomId){
            return errorMessage(res, 400, "Something Went Wrong", [])
        }

        let insertNotification = await ChatNotification.create({senderId, receiverId, chatRoomId})

        if(!insertNotification){
            return errorMessage(res, 400, "Something Went Wrong", [])
        }

        return successMessage(res, "notification inserted successfully", [])
    }
    catch (error) {
        return res.status(400).send({
            status: 0,
            error: error,
            message: "Internal Server Errorrr"
        })
    }
})


export default router