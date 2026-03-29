import express from 'express'
import { sendOtp } from '../../../config/sendOtp.js'
import jwt from 'jsonwebtoken'
import { User } from '../../../models/user.model.js'

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
            return res.status(400).send({
                statue: 0,
                message: "email is required",
                userId: ""
            })
        }

        let email = req.body.email.toLowerCase()
        const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!email.match(emailFormat)) {
            return res.status(400).send({
                status: 0,
                message: "invalid email format",
                userId: ""
            })
        }
        const checkUser = await User.findOne({ email: email })
        if (!checkUser) {
            return res.status(409).send({
                status: 0,
                message: "invalid email",
                userId: ""
            })
        }

        let verificationOTP = Math.floor(100000 + Math.random() * 900000)
        const expiryOTP = Date.now() + 2 * 60 * 1000;

        const updateOtp = await User.updateOne(
            { email, },
            { $set: { otp: verificationOTP, expiry: expiryOTP } },
            {}
        )
        if (!updateOtp) {
            return res.status(400).send({
                status: 0,
                message: "something went wrong",
                userId: ""
            })
        }

        sendOtp(`${email}`, `${verificationOTP}`);
        return res.status(200).send({
            status: 1,
            message: "otp sent to your email",
            userId: checkUser._id
        })
    }
    catch (error) {
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error"
        })
    }
})

export default router