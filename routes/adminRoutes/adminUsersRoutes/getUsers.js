import express from 'express'
import { User } from '../../../models/user.model.js'
import { errorMessage, successMessage } from '../../../utils/responseMessage.js'
const router = express.Router()

router.get('/user', async (req, res) => {
    try {
        let findUsers = await User.find()
        let filteredUsers = findUsers.filter((v, i) => !v.isAdmin)
        if (!filteredUsers.length) {
            return errorMessage(res, 404, "users not found", [])
        }
        
        return successMessage(res, "fetch all users successfully", filteredUsers)
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