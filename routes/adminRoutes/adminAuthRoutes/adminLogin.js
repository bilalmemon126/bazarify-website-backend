import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../../../models/user.model.js'
import { errorMessage, successMessage } from '../../../utils/responseMessage.js'

const router = express.Router()

router.post("/login", async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return errorMessage(res, 400, "Both fields are required", [])
        }

        let email = req.body.email.toLowerCase()
        const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        if (!email.match(emailFormat)) {
            return errorMessage(res, 400, "Invalid email format", [])
        }

        let checkUser = await User.findOne({ email }).select("+password")

        if (!checkUser) {
            return errorMessage(res, 404, "Email or Password is Invalid", [])
        }

        if (!checkUser.isVerified) {
            return errorMessage(res, 403, "User Not Verified", [])
        }

        let hashedPassword = bcrypt.compareSync(req.body.password, checkUser.password)

        if (!hashedPassword) {
            return errorMessage(res, 400, "Email or Password is Invalid", [])
        }

        if (!checkUser.isAdmin) {
            return errorMessage(res, 403, "Only admin can login", [])
        }

        const oldToken = req.cookies.token

        if (oldToken) {
            const decoded = jwt.verify(oldToken, process.env.MY_SECRET)
            if (decoded) {
                res.clearCookie('token', {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                })
            }
        }

        const token = jwt.sign({
            firstName: checkUser.firstName,
            userId: checkUser._id,
            email: checkUser.email
        }, process.env.MY_SECRET, { expiresIn: "1h" })

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })

        const sendUserData = await User.findOne({ _id: checkUser._id })

        return successMessage(res, "Login successfully", sendUserData)

    }
    catch (error) {
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error"
        })
    }
})

export default router