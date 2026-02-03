import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../models/user.model.js'
import { Chat } from '../../models/chat.model.js'
import mongoose from 'mongoose'
const router = express.Router()

router.get('/chat/:userId', async (req, res) => {
    try {
        let userId = new ObjectId(req.params.userId)
        let checkUser = await User.findOne({ _id: userId })

        if (!checkUser) {
            return res.status(400).send({
                status: 0,
                message: "user not found",
                allChats: []
            })
        }

        const getAllChats = await Chat.aggregate([
            {
              $match: {
                $or: [
                  { buyerId: new mongoose.Types.ObjectId(userId) },
                  { sellerId: new mongoose.Types.ObjectId(userId) }
                ]
              }
            },
            {
              $group: {
                _id: "$roomId",
                chat: { $first: "$$ROOT" }
              }
            },
            {
              $replaceRoot: { newRoot: "$chat" }
            }
          ]);
          
          await Chat.populate(getAllChats, [
            { path: "productId", select: "mainImage title" },
            { path: "buyerId", select: "firstName lastName" },
            { path: "sellerId", select: "firstName lastName" }
          ]);

        if (!getAllChats) {
            return res.status(400).send({
                status: 0,
                message: "something went wrong",
                allChats: []
            })
        }

        return res.status(200).send({
            status: 1,
            message: "all chats fetched successfully",
            allChats: getAllChats
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