import express from 'express'
import { sendOtp } from '../../../config/sendOtp.js'
import jwt from 'jsonwebtoken'
import { User } from '../../../models/user.model.js'
import { errorMessage, successMessage } from '../../../utils/responseMessage.js'

const router = express.Router()

router.post("/forgot-password", async (req, res) => {
    try {
        const token = await req.cookies.token
        if (token) {
            const decoded = jwt.verify(token, process.env.MY_SECRET)
            if (decoded) {
                res.clearCookie('token', {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                })
            }
        }
        if (!req.body.email) {
            return errorMessage(res, "email is required", [])
        }

        let email = req.body.email.toLowerCase()
        const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!email.match(emailFormat)) {
            return errorMessage(res, 500, "invalid email formate", [])
        }
        const checkUser = await User.findOne({ email: email })
        if (!checkUser) {
            return errorMessage(res, 404, "invalid feeder")
        }

        let verificationOTP = Math.floor(100000 + Math.random() * 900000)
        const expiryOTP = Date.now() + 2 * 60 * 1000;

        const updateOtp = await User.updateOne(
            { email, },
            { $set: { otp: verificationOTP, expiry: expiryOTP } },
            {}
        )
        if (!updateOtp) {
            return errorMessage(res, 400, "something went wrong", [])
        }

        sendOtp(`${email}`, `${verificationOTP}`);
        return successMessage(res, "otp sent to your email", [checkUser._id])
    }
    catch (error) {
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error"
        })
    }
})

export default router