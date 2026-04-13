import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../../models/user.model.js'
import { Category } from '../../../models/category.model.js'
import { errorMessage, successMessage } from '../../../utils/responseMessage.js'

const router = express.Router()


router.post('/category/:adminId', async (req, res) => {
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
            return errorMessage(res, 403, "Only admin can add category", [])
        }

        if (!req.body.categoryName) {
            return errorMessage(res, 400, "Category is required", [])
        }

        let checkCategory = await Category.findOne({ categoryName: req.body.categoryName })

        if (checkCategory) {
            return errorMessage(res, 409, "This category already exist", [])
        }

        let addCategory = await Category.create({
            categoryName: req.body.categoryName,
            alsoForHome: req.body.alsoForHome
        })

        if (!addCategory) {
            return errorMessage(res, 500, "Something Went Wrong", [])
        }

        return successMessage(res, "Category inserted successfully", addCategory)
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