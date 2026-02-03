import express from 'express'
import { User } from '../../models/user.model.js'
import { Product } from '../../models/product.model.js'
import { Chat } from '../../models/chat.model.js'
const router = express.Router()

router.post('/chat', async (req, res) => {
    try {
        let checkBuyer = await User.findOne({ _id: req.body.buyerId })
        let checkSeller = await User.findOne({ _id: req.body.sellerId })
        let findProduct = await Product.findOne({ _id: req.body.productId })

        if (checkBuyer) {
            if(checkSeller){
                if(findProduct){
                    let data = {
                        buyerId: req.body.buyerId,
                        sellerId: req.body.sellerId,
                        productId: req.body.productId,
                        message: req.body.message,
                        senderId: req.body.senderId,
                        roomId: req.body.roomId
                    }
    
                    let insert = await Chat.insertOne(data)
                    if (insert) {
                        return res.status(200).send({
                            status: 1,
                            message: "chat created successfully",
                            chatId: insert._id
                        })
                    }
                    else {
                        return res.send({
                            status: 0,
                            message: "Something Went Wrong",
                            chatId: ""
                        })
                    }
                }
                else{
                    return res.send({
                        status: 0,
                        message: "product not found"
                    })
                }
            }
            else {
                return res.send({
                    status: 0,
                    message: "something went wrong"
                })
            }
        }
        else {
            return res.send({
                status: 0,
                message: "something went wrong"
            })
        }
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