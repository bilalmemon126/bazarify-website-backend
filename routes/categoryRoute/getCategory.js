import express from 'express'
import { Category } from '../../models/category.model.js'

const router = express.Router()


router.get('/category', async (req, res) => {
    try {
        let getCategory = await Category.find()

        if (!getCategory) {
            return res.status(400).send({
                status: 0,
                message: "category not found",
                data: []
            })
        }

        return res.send({
            status: 1,
            message: "all categories fetched successfully",
            data: getCategory
        })
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