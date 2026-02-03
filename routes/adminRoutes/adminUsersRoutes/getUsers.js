import express from 'express'
import { User } from '../../../models/user.model.js'
const router = express.Router()

router.get('/user', async (req, res) => {
    try {
        let findUsers = await User.find()
        let filteredUsers = findUsers.filter((v, i) => !v.isAdmin)
        if (filteredUsers.length > 0) {
            return res.status(200).send({
                status: 1,
                message: "fetch all users successfully",
                data: filteredUsers
            })
        }
        else {
            return res.status(400).send({
                status: 0,
                message: "users not found",
                data: []
            })
        }
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