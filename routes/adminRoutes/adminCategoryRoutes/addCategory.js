import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../../models/user.model.js'
import { Category } from '../../../models/category.model.js'

const router = express.Router()


router.post('/category/:adminId', async (req, res) => {
    try {
        let adminId = new ObjectId(req.params.adminId)
        let checkAdmin = await User.findOne({ _id: adminId })
        if (checkAdmin) {
            if (!checkAdmin.isAdmin) {
                return res.status(400).send({
                    status: 0,
                    message: "only admin can add category"
                })
            }

            if(!req.body.categoryName){
                return res.status(400).send({
                    status: 0,
                    message: "category is required"
                })
            }

            let checkCategory = await Category.findOne({categoryName: req.body.categoryName})

            if(checkCategory){
                return res.status(400).send({
                    status: 0,
                    message: "this category already exist"
                })
            }

            let addCategory = Category.create({
                categoryName: req.body.categoryName,
                alsoForHome: req.body.alsoForHome
            })

            if(!addCategory){
                return res.status(400).send({
                    status: 0,
                    message: "something went wrong"
                })
            }

            return res.send({
                status: 1,
                message: "category inserted successfully"
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