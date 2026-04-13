import express from 'express'
import jwt from 'jsonwebtoken'
import { errorMessage, successMessage } from '../../utils/responseMessage.js'

const router = express.Router()

router.post("/logout", async (req, res) => {
    try {
        const token = await req.cookies.token
        if (!token) {
            return errorMessage(res, 401, "unauthorized", [])
        }
        else {
            const decoded = jwt.verify(token, process.env.MY_SECRET)
            if (decoded) {
                res.clearCookie('token', {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                })
                return successMessage(res, "logout successfully", [])
            }
        }
    }
    catch (error) {
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error"
        })
    }
})

export default router