import express from 'express'
import jwt from 'jsonwebtoken'
import { errorMessage, successMessage } from '../../../utils/responseMessage.js'


const router = express.Router()

router.get("/reset-password/protected", async (req, res, next) => {
    try {
        const resetToken = await req.cookies.resetToken

        if (!resetToken) {
            return res.status(401).send({
                status: 0,
                myToken: token,
                message: "verify your email to reset your password"
            })
        }
        const decoded = jwt.verify(resetToken, process.env.MY_SECRET)

        if (!decoded) {
            return errorMessage(res, 400, "invalid token", [])
        }

        return successMessage(res, "verified user", [])
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