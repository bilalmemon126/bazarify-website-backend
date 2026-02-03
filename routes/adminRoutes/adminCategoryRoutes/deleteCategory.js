import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../../models/user.model.js'
import { Category } from '../../../models/category.model.js'

const router = express.Router()


router.delete('/category/:categoryId/:adminId', async (req, res) => {
    try {
        let categoryId = new ObjectId(req.params.categoryId)
        let adminId = new ObjectId(req.params.adminId)
        let checkCategory = await Category.findOne({_id: categoryId})
        let checkAdmin = await User.findOne({ _id: adminId })
        if (checkAdmin) {
            if (!checkAdmin.isAdmin) {
                return res.status(400).send({
                    status: 0,
                    message: "only admin can delete category"
                })
            }

            if(!checkCategory){
                return res.status(400).send({
                    status: 0,
                    message: "category not found"
                })
            }

            let deleteCategory = await Category.deleteOne({_id: categoryId})

            if(!deleteCategory){
                return res.status(400).send({
                    status: 0,
                    message: "something went wrong"
                })
            }

            return res.send({
                status: 1,
                message: "category deleted successfully"
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