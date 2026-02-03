import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../../models/user.model.js'
import { Location } from '../../../models/location.model.js'

const router = express.Router()


router.put('/location/:locationId/:adminId', async (req, res) => {
    try {
        let locationId = new ObjectId(req.params.locationId)
        let adminId = new ObjectId(req.params.adminId)
        let checkLocation = await Location.findOne({_id: locationId})
        let checkAdmin = await User.findOne({ _id: adminId })
        if (checkAdmin) {
            if (!checkAdmin.isAdmin) {
                return res.status(400).send({
                    status: 0,
                    message: "only admin can edit location"
                })
            }

            if(!checkLocation){
                return res.status(400).send({
                    status: 0,
                    message: "location not found"
                })
            }

            if(!req.body.location){
                return res.status(400).send({
                    status: 0,
                    message: "location is required"
                })
            }

            let checkLocationField = await Location.findOne({_id: {$ne: locationId}, location: req.body.location})

            if(checkLocationField){
                return res.status(400).send({
                    status: 0,
                    message: "this location already exist"
                })
            }

            let editLocation = await Location.updateOne(
                {_id: locationId},
                {$set: {location: req.body.location}},
                {}
            )

            if(!editLocation){
                return res.status(400).send({
                    status: 0,
                    message: "something went wrong"
                })
            }

            return res.send({
                status: 1,
                message: "location updated successfully"
            })
        }
        else {
            return res.send({
                status: 0,
                message: "something went wrong"
            })
        }
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