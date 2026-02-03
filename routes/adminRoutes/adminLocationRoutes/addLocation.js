import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../../models/user.model.js'
import { Location } from '../../../models/location.model.js'

const router = express.Router()


router.post('/location/:adminId', async (req, res) => {
    try {
        let adminId = new ObjectId(req.params.adminId)
        let checkAdmin = await User.findOne({ _id: adminId })
        if (checkAdmin) {
            if (!checkAdmin.isAdmin) {
                return res.status(400).send({
                    status: 0,
                    message: "only admin can add location"
                })
            }

            if(!req.body.location){
                return res.status(400).send({
                    status: 0,
                    message: "location is required"
                })
            }

            let checkLocation = await Location.findOne({location: req.body.location})

            if(checkLocation){
                return res.status(400).send({
                    status: 0,
                    message: "this location already exist"
                })
            }

            let addLocation = Location.create({
                location: req.body.location
            })

            if(!addLocation){
                return res.status(400).send({
                    status: 0,
                    message: "something went wrong"
                })
            }

            return res.send({
                status: 1,
                message: "location inserted successfully"
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