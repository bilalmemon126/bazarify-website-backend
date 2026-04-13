import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../../models/user.model.js'
import { Location } from '../../../models/location.model.js'
import { errorMessage, successMessage } from '../../../utils/responseMessage.js'

const router = express.Router()


router.delete('/location/:locationId/:adminId', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.locationId) || !ObjectId.isValid(req.params.adminId)) {
            return errorMessage(res, 400, "Invalid ID format", [])
        }

        let locationId = new ObjectId(req.params.locationId)
        let adminId = new ObjectId(req.params.adminId)
        let checkAdmin = await User.findOne({ _id: adminId })
        let checkLocation = await Location.findOne({ _id: locationId })

        if (!checkAdmin) {
            return errorMessage(res, 404, "Admin Not Found", [])
        }

        if (!checkAdmin.isAdmin) {
            return errorMessage(res, 403, "Only admin can delete location", [])
        }

        if (!checkLocation) {
            return errorMessage(res, 404, "Location Not Found", [])
        }

        let deleteLocation = await Location.deleteOne({ _id: locationId })

        if (!deleteLocation.deletedCount) {
            return errorMessage(res, 500, "Something Went Wrong", [])
        }

        return successMessage(res, "Location deleted successfully", [])
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