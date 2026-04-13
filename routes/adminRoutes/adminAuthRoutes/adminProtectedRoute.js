import express from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../../../models/user.model.js'
import { errorMessage, successMessage } from '../../../utils/responseMessage.js'


const router = express.Router()

router.get("/protected", async (req, res) => {
    try{
        const token = req.cookies.token

        if (!token) {
            return errorMessage(res, 401, "Unauthorized", [])
        }

        const decoded = jwt.verify(token, process.env.MY_SECRET)

        if (!decoded) {
            return errorMessage(res, 401, "Invalid token", [])
        }

        let checkAdmin = await User.findOne({ _id: decoded.userId })

        if (!checkAdmin) {
            return errorMessage(res, 404, "Admin Not Found", [])
        }

        if (!checkAdmin.isAdmin) {
            return errorMessage(res, 403, "Only admin can access this route", [])
        }

        return successMessage(res, "Now you can access all routes", [])
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