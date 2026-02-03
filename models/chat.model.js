import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    message: {
        type: String,
        trim: true,
        default: null,
        required: false
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    roomId: {
        type: String,
        trim: true,
        default: null,
        required: false
    }
},
{
    timestamps: true
})

export const Chat = mongoose.model('Chat', chatSchema)