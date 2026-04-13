import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../../models/user.model.js'
import { Location } from '../../../models/location.model.js'
import { errorMessage, successMessage } from '../../../utils/responseMessage.js'

const router = express.Router()


router.post('/location/:adminId', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.adminId)) {
            return errorMessage(res, 400, "Invalid ID format", [])
        }

        let adminId = new ObjectId(req.params.adminId)
        let checkAdmin = await User.findOne({ _id: adminId })

        if (!checkAdmin) {
            return errorMessage(res, 404, "Admin Not Found", [])
        }

        if (!checkAdmin.isAdmin) {
            return errorMessage(res, 403, "Only admin can add location", [])
        }

        if (!req.body.location) {
            return errorMessage(res, 400, "Location is required", [])
        }

        let checkLocation = await Location.findOne({ location: req.body.location })

        if (checkLocation) {
            return errorMessage(res, 409, "This location already exist", [])
        }

        let addLocation = await Location.create({
            location: req.body.location
        })

        if (!addLocation) {
            return errorMessage(res, 500, "Something Went Wrong", [])
        }

        return successMessage(res, "Location inserted successfully", addLocation)
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