import mongoose from "mongoose";

const chatNotificationSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    chatRoomId: {
        type: String,
        trim: true,
        default: null,
        required: false
    }
})

export const ChatNotification = mongoose.model('ChatNotification', chatNotificationSchema)