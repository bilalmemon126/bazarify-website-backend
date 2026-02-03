import express from 'express'
import { Location } from '../../models/location.model.js'

const router = express.Router()


router.get('/location', async (req, res) => {
    try {
        let getLocation = await Location.find()

        if (!getLocation) {
            return res.status(400).send({
                status: 0,
                message: "location not found",
                data: []
            })
        }

        return res.send({
            status: 1,
            message: "all locations fetched successfully",
            data: getLocation
        })
    }
    catch (error) {
        return res.status(400).send({
            status: 0,
            error: error,
            message: "Internal Server Errorrrr"
        })
    }
})


export default router