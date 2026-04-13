import express from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../../models/user.model.js'
import { errorMessage, successMessage } from '../../utils/responseMessage.js'


const router = express.Router()

router.get("/protected", async (req, res, next) => {
    try {
        const token = await req.cookies.token

        if (!token) {
            res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            })
            return res.status(401).send({
                status: 0,
                myToken: token,
                message: "unauthorized"
            })
        }
        const decoded = jwt.verify(token, process.env.MY_SECRET, (err, decoded) => {
            if(err && err.name === 'TokenExpiredError'){
                res.clearCookie('token', {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                })
                
                return errorMessage(res, 400, "token expired", [])
            }
            return decoded
        })

        let checkUser = await User.findOne({_id: decoded.userId})
        if(!checkUser){
            return errorMessage(res, 401, "please login your account", [])
        }

        if(checkUser.isBlocked){
            return errorMessage(res, 403, "your account is blocked", [])
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