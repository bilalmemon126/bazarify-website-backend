import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../../models/user.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const router = express.Router()

router.post("/reset-password/:id", async (req, res) => {
    try {
        let userId = new ObjectId(req.params.id)
        let findUser = await User.findOne({ _id: userId })
        if (!findUser) {
            return res.status(400).send({
                status: 0,
                message: "something went wrong",
                data: ""
            })
        }
        if (!req.body.password || !req.body.confirmPassword) {
            return res.status(401).send({
                status: 0,
                message: "all fields are required",
                data: ""
            })
        }
        const resetToken = await req.cookies.resetToken
        if (!resetToken) {
            return res.status(400).send({
                status: 0,
                message: "verify your email to change your password",
                data: ""
            })
        }
        const decoded = jwt.verify(resetToken, process.env.MY_SECRET)
        if (!decoded) {
            return res.status(400).send({
                status: 0,
                message: "invalid token",
                data: ""
            })
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).send({
                status: 0,
                message: "password and confirm password must be same",
                data: ""
            })
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;
        if (!passwordRegex.test(req.body.password)) {
            return res.status(400).send({
                status: 0,
                message: "please choose strong password",
                data: ""
            })
        }

        const hashedPassword = await bcrypt.hashSync(req.body.password, 10)

        let resetPassword = await User.updateOne(
            { _id: userId },
            { $set: { password: hashedPassword } },
            {}
        )

        if (!resetPassword) {
            return res.status(400).send({
                statue: 0,
                message: "something went wrong",
                data: ""
            })
        }


        res.clearCookie('resetToken', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })

        return res.status(200).send({
            status: 1,
            message: "password changed successfully",
            data: findUser
        })
    }
    catch (err) {
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error"
        })
    }
})

export default router