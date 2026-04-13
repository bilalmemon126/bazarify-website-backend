import express from 'express'
import { Location } from '../../models/location.model.js'
import { errorMessage, successMessage } from '../../utils/responseMessage.js'

const router = express.Router()


router.get('/location', async (req, res) => {
    try {
        let getLocation = await Location.find()

        if (!getLocation) {
            return errorMessage(res, 404, "location not found", [])
        }

        return successMessage(res, "all location fetched successfully", getLocation)
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