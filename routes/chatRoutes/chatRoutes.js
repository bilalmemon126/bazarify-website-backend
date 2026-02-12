import express from "express"
import getMessageRoute from "./getMessage.js"
import getAllMessageRoute from "./getMyAllMessages.js"
import getAllNotificationRoute from "./getNotifications.js"
import sendMessageRoute from "./sendMessage.js"

const router = express.Router()

router.use("/chat", getMessageRoute)
router.use("/chat", getAllMessageRoute)
router.use("/chat", getAllNotificationRoute)
router.use(sendMessageRoute)

export default router