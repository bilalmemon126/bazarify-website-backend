import express from "express"
import addChatNotifications from "./addChatNotifications.js"
import getChatNotifications from "./getChatNotifications.js"
import deleteChatNotifications from "./deleteChatNotifications.js"
import getMessageRoute from "./getMessage.js"
import getAllMessageRoute from "./getMyAllMessages.js"
import sendMessageRoute from "./sendMessage.js"

const router = express.Router()

router.use("/chat", addChatNotifications)
router.use("/chat", getChatNotifications)
router.use("/chat", deleteChatNotifications)
router.use("/chat", getMessageRoute)
router.use("/chat", getAllMessageRoute)
router.use("/chat", sendMessageRoute)

export default router