import express from 'express'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'
import { User } from '../../models/user.model.js'
import { errorMessage, successMessage } from '../../utils/responseMessage.js'

const router = express.Router()

router.post("/user-otpverification/:id", async (req, res) => {
    let userId = new ObjectId(req.params.id)
    let findUser = await User.findOne({ _id: userId })
    if (!findUser) {
        return errorMessage(res, 400, "something went wrong", [])
    }
    if (!req.body.otp) {
        return errorMessage(res, 404, "please enter your otp", [])
    }
    if (req.body.otp == findUser.otp) {
        if (Date.now() > findUser.expiry) {
            let deletedUser = await User.deleteOne({ _id: userId })
            if (deletedUser) {
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
            const token = jwt.sign({
                userId: findUser._id,
                firstName: findUser.firstName,
                email: findUser.email
            }, process.env.MY_SECRET, { expiresIn: "1h" })

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            })
            const sendUserData = await User.findOne({ _id: userId }, { projection: { _id: 1, firstName: 1 } })
            return successMessage(res, "now you can login", sendUserData)
        }
    }
    else {
        return errorMessage(res, 401, "invalid OTP", [])
    }
})

export default router