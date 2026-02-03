import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../../models/user.model.js'
const router = express.Router()

router.put('/user/:userId/:adminId', async (req, res) => {
    try {
        let userId = new ObjectId(req.params.userId)
        let adminId = new ObjectId(req.params.adminId)
        let checkUser = await User.findOne({ _id: userId })
        let checkAdmin = await User.findOne({ _id: adminId })

        
        if (!checkAdmin) {
            return res.status(400).send({
                status: 0,
                message: "only admin can access this route"
            })
        }

        if(!checkAdmin.isAdmin){
            return res.status(400).send({
                status: 0,
                message: "only admin can update this user"
            })
        }

        if (!checkUser) {
            return res.send({
                status: 0,
                message: "user Not Found"
            })
        }

        let updateUser =await User.updateOne(
            {_id: userId},
            {$set: {isBlocked: !checkUser.isBlocked}},
            {}
        )

        if (!updateUser) {
            return res.send({
                status: 0,
                message: "Something Went Wrong"
            })
        }

        return res.send({
            status: 1,
            message: "user updated Successfully"
        })
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