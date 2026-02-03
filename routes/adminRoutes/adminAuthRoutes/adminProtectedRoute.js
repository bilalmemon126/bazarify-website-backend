import express from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../../../models/user.model.js'


const router = express.Router()

router.get("/protected", async (req, res) => {
    try{
        const token =await req.cookies.token
        if(!token){
            return res.status(401).send({
                status: 0,
                message: "unauthorized"
            })
        }
        const decoded = jwt.verify(token, process.env.MY_SECRET)

        let checkAdmin = await User.findOne({_id: decoded.userId})

        if(!checkAdmin.isAdmin){
            return res.status(400).send({
                status: 0,
                message: "only admin can access this routes"
            })
        }

        return res.status(200).send({
            status: 1,
            message: "now you can access all routes"
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