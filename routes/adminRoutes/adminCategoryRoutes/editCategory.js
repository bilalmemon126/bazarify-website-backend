import express from 'express'
import { ObjectId } from 'mongodb'
import { User } from '../../../models/user.model.js'
import { Category } from '../../../models/category.model.js'
import { errorMessage, successMessage } from '../../../utils/responseMessage.js'

const router = express.Router()


router.put('/category/:categoryId/:adminId', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.categoryId) || !ObjectId.isValid(req.params.adminId)) {
            return errorMessage(res, 400, "Invalid ID format", [])
        }

        let categoryId = new ObjectId(req.params.categoryId)
        let adminId = new ObjectId(req.params.adminId)
        let checkAdmin = await User.findOne({ _id: adminId })
        let checkCategory = await Category.findOne({ _id: categoryId })

        if (!checkAdmin) {
            return errorMessage(res, 404, "Admin Not Found", [])
        }

        if (!checkAdmin.isAdmin) {
            return errorMessage(res, 403, "Only admin can edit category", [])
        }

        if (!checkCategory) {
            return errorMessage(res, 404, "Category Not Found", [])
        }

        if (!req.body.categoryName) {
            return errorMessage(res, 400, "Category is required", [])
        }

        let checkCategoryName = await Category.findOne({ _id: { $ne: categoryId }, categoryName: req.body.categoryName })

        if (checkCategoryName) {
            return errorMessage(res, 409, "This category already exist", [])
        }

        let editCategory = await Category.updateOne(
            { _id: categoryId },
            { $set: { categoryName: req.body.categoryName, alsoForHome: req.body.alsoForHome } }
        )

        if (!editCategory.modifiedCount) {
            return errorMessage(res, 500, "Something Went Wrong", [])
        }

        return successMessage(res, "Category updated successfully", [])
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