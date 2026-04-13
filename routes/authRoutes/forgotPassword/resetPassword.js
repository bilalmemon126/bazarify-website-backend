import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../../models/user.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { errorMessage, successMessage } from '../../../utils/responseMessage.js'

const router = express.Router()

router.post("/reset-password/:id", async (req, res) => {
    try {
        let userId = new ObjectId(req.params.id)
        let findUser = await User.findOne({ _id: userId })
        if (!findUser) {
            return errorMessage(res, 400, "something went wrong", [])
        }
        if (!req.body.password || !req.body.confirmPassword) {
            return errorMessage(res, 404, "all fields are required", [])
        }
        const resetToken = await req.cookies.resetToken
        if (!resetToken) {
            return successMessage(res, 401, "verify your email to change you password", [])
        }
        const decoded = jwt.verify(resetToken, process.env.MY_SECRET)
        if (!decoded) {
            return errorMessage(res, 400, "invalid token", [])
        }

        if (req.body.password !== req.body.confirmPassword) {
            return errorMessage(res, 400, "please choose strong password", [])
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;
        if (!passwordRegex.test(req.body.password)) {
            return errorMessage(res, 400, "please choose strong password", [])
        }

        const hashedPassword = await bcrypt.hashSync(req.body.password, 10)

        let resetPassword = await User.updateOne(
            { _id: userId },
            { $set: { password: hashedPassword } },
            {}
        )

        if (!resetPassword) {
            return errorMessage(res, 400, "something went wrong", [])
        }


        res.clearCookie('resetToken', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })

        return successMessage(res, "password changed successfully")
    }
    catch (err) {
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error"
        })
    }
})

export default router