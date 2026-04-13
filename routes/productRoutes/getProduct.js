import express from 'express'
import { ObjectId } from 'mongodb'
import { Product } from '../../models/product.model.js'
import { Category } from '../../models/category.model.js'
import { errorMessage, successMessage } from '../../utils/responseMessage.js'
const router = express.Router()


router.get('/products/:userId', async (req, res) => {
    try {
        console.log("get product route")
        if (!ObjectId.isValid(req.params.userId)) {
            return errorMessage(res, 400, "Invalid ID format", [])
        }

        let filter = {createdBy: {$ne: req.params.userId}}
        let sort = {createdAt: -1}
        let projection ={}
        
        filter.isBlocked = false
        
        if(req.query.search){
            filter.$text = {$search: req.query.search}
            sort = {score: {$meta: "textScore"}}
            projection.score = {$meta: "textScore"}
        }

        if(req.query.category){
            let findCategory = await Category.findOne({categoryName: req.query.category})
            if(!findCategory){
                return errorMessage(res, 404, "category not found", [])
            }
            filter.category = findCategory._id
        }

        if(req.query.location){
            filter.location = req.query.location
        }

        if(req.query.productId){
            filter._id = {$ne: req.query.productId}
        }

        if(req.query.minPrice || req.query.maxPrice){
            filter.price = {}

            if(req.query.minPrice){
                filter.price.$gte = Number(req.query.minPrice)
            }
            if(req.query.maxPrice){
                filter.price.$lte = Number(req.query.maxPrice)
            }
        }


        if(req.query.sort === "lowestPrice"){
            sort = {price: 1}
        }

        if(req.query.sort === "highestPrice"){
            sort = {price: -1}
        }
        
        let findProducts = await Product.find(filter, projection)
        .sort(sort)
        .populate("category createdBy location")
        .limit(req.query.limit || "")

        if (findProducts.length === 0) {
            return errorMessage(res, 404, "Product Not Found", [])
        }

        return successMessage(res, "all products fetched successfully", findProducts)
    }
    catch (error) {
        return res.status(500).send({
            status: 0,
            error: error,
            message: "Internal Server Error"
        })
    }
})

export default router