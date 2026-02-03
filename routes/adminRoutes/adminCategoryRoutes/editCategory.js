import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../../models/user.model.js'
import { Category } from '../../../models/category.model.js'

const router = express.Router()


router.put('/category/:categoryId/:adminId', async (req, res) => {
    try {
        let categoryId = new ObjectId(req.params.categoryId)
        let adminId = new ObjectId(req.params.adminId)
        let checkCategory = await Category.findOne({_id: categoryId})
        let checkAdmin = await User.findOne({ _id: adminId })
        if (checkAdmin) {
            if (!checkAdmin.isAdmin) {
                return res.status(400).send({
                    status: 0,
                    message: "only admin can edit category"
                })
            }

            if(!checkCategory){
                return res.status(400).send({
                    status: 0,
                    message: "category not found"
                })
            }

            if(!req.body.categoryName){
                return res.status(400).send({
                    status: 0,
                    message: "category is required"
                })
            }

            let checkCategoryName = await Category.findOne({_id: {$ne: categoryId}, categoryName: req.body.categoryName})

            if(checkCategoryName){
                return res.status(400).send({
                    status: 0,
                    message: "this category already exist"
                })
            }

            let editCategory = await Category.updateOne(
                {_id: categoryId},
                {$set: {categoryName: req.body.categoryName, alsoForHome: req.body.alsoForHome}},
                {}
            )

            if(!editCategory){
                return res.status(400).send({
                    status: 0,
                    message: "something went wrong"
                })
            }

            return res.send({
                status: 1,
                message: "category updated successfully"
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