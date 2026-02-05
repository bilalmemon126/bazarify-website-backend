import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../models/user.model.js'
import { Favourite } from '../../models/favourite.model.js'

const router = express.Router()

router.get('/favourite/:userId', async (req, res) => {
    try {
        let userId = new ObjectId(req.params.userId)
        let checkUser = await User.findOne({ _id: userId })

        if (!checkUser) {
            return res.send({
                status: 0,
                message: "something went wrong",
                data: []
            })
        }

        let favourites = await Favourite.find({ userId })
        .populate("productId")

        if (!favourites.length) {
            return res.status(400).send({
                status: 0,
                message: "No favourite products found",
                data: []
            }) 
        }

        return res.status(200).send({
            status: 1,
            message: "get all favourite products successfully",
            data: favourites
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