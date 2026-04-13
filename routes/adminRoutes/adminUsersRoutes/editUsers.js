import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../../models/user.model.js'
import { errorMessage, successMessage } from '../../../utils/responseMessage.js'
const router = express.Router()

router.put('/user/:userId/:adminId', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.userId) || !ObjectId.isValid(req.params.adminId)) {
            return errorMessage(res, 400, "Invalid ID format", [])
        }
        let userId = new ObjectId(req.params.userId)
        let adminId = new ObjectId(req.params.adminId)
        let checkUser = await User.findOne({ _id: userId })
        let checkAdmin = await User.findOne({ _id: adminId })

        
        if (!checkAdmin) {
            return errorMessage(res, 404, "Admin Not Found", [])
        }

        if (!checkAdmin.isAdmin) {
            return errorMessage(res, 403, "Only admin can update this user", [])
        }

        if (!checkUser) {
            return errorMessage(res, 404, "User Not Found", [])
        }

        let updateUser =await User.updateOne(
            {_id: userId},
            {$set: {isBlocked: !checkUser.isBlocked}},
            {}
        )

        if (!updateUser) {
            return errorMessage(res, 500, "Something Went Wrong", [])
        }

        return successMessage(res, "User updated successfully", [])
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