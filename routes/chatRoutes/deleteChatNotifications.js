import express from 'express'
import { ObjectId } from 'mongodb'
import { ChatNotification } from '../../models/chatNotification.model.js'
import { User } from '../../models/user.model.js'
const router = express.Router()

router.delete('/notifications/:userId', async (req, res) => {
    try {
        let userId = new ObjectId(req.params.userId)
        let checkUser = await User.findOne({_id: userId})

        if (!checkUser) {
            return res.status(400).send({
                status: 0,
                message: "user not found"
            })
        }

        let {chatRoomId} = req.body

        if(!chatRoomId){
            return res.status(400).send({
                status: 0,
                message: "something went wrong"
            })
        }

        let deleteNotification = await ChatNotification.deleteMany({receiverId: userId, chatRoomId})

        if(!deleteNotification){
            return res.status(400).send({
                status: 0,
                message: "something went wrong"
            })
        }


        return res.status(200).send({
            status: 1,
            message: "notification deleted successfully"
        })
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