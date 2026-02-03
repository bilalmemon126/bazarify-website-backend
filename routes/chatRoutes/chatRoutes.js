import express from "express"
import getMessageRoute from "./getMessage.js"
import getAllMessageRoute from "./getMyAllMessages.js"
import sendMessageRoute from "./sendMessage.js"

const router = express.Router()

router.use(getMessageRoute)
router.use(getAllMessageRoute)
router.use(sendMessageRoute)

export default router