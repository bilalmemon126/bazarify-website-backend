import express from 'express'
import { Category } from '../../models/category.model.js'
import { errorMessage, successMessage } from '../../utils/responseMessage.js'

const router = express.Router()


router.get('/category', async (req, res) => {
    try {
        let getCategory = await Category.find()

        if (!getCategory) {
            errorMessage(res, 404, "category not found", [])
        }

        
        return successMessage(res, "all categories fetched successfully", getCategory)
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