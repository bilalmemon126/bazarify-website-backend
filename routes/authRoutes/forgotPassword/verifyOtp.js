import express from 'express'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'
import { User } from '../../../models/user.model.js'
import { errorMessage, successMessage } from '../../../utils/responseMessage.js'

const router = express.Router()

router.post("/verify-otp/:id", async (req, res) => {
    try {
        let userId = new ObjectId(req.params.id)
        let findUser = await User.findOne({ _id: userId })
        if (!findUser) {
            errorMessage(res, 400, "something went wrong", [])
        }
        if (!req.body.otp) {
            return errorMessage(res, 404, "please enter your otp", [])
        }
        if (req.body.otp == findUser.otp) {
            if (Date.now() > findUser.expiry) {
                let otpNotVerified = await User.updateOne(
                    { _id: userId },
                    { $set: { otp: true, expiry: "" } },
                    {}
                )
                if (otpNotVerified) {
                    return errorMessage(res, 410, "your OTP has expired", [])
                }
            }
            else {
                let updateVerifiedUser = await User.updateOne(
                    { _id: userId },
                    { $set: { otp: true, expiry: "", isVerified: true } },
                    {}
                )
                if (!updateVerifiedUser) {
                    return errorMessage(res, 400, "something went wrong", [])
                }

                const resetToken = jwt.sign({
                    userId: findUser._id,
                    fullName: findUser.fullName,
                    email: findUser.email
                }, process.env.MY_SECRET, { expiresIn: "1h" })

                res.cookie("resetToken", resetToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                })
                return successMessage(res, "now you can change your password", sendUserData)
            }
        }
        else {
            return errorMessage(res, 401, "invalid OTP", [])
        }
    }
    catch (err) {
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error"
        })
    }
})

export default router