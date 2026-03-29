import express from 'express'
import jwt from 'jsonwebtoken'


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
            return res.status(400).send({
                status: 0,
                message: "invalid token"
            })
        }

        return res.status(200).send({
            status: 1,
            message: "verified user"
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