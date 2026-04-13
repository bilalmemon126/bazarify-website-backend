import express from 'express'
import { ObjectId } from 'mongodb'
import { Product } from '../../models/product.model.js'
import { Category } from '../../models/category.model.js'
import { errorMessage, successMessage } from '../../utils/responseMessage.js'
const router = express.Router()


router.get('/product/home', async (req, res) => {
    try {
        let filter = {}
        if(req.query.userId){
            filter.createdBy = {$ne: req.query.userId}
        }

        let findCategory = await Category.find({ alsoForHome: true })

        
        if (!findCategory.length) {
            return errorMessage(res, 404, "category not found", [])
        }
        
        
        let allProducts = []
        
        let fetchingProducts = findCategory.map((v, i) => {
            filter.category = v._id
            
            return Product.find(filter)
            .sort({ createdAt: -1 })
            .limit(4)
            .populate("category createdBy location")
            .then(products => ({
                title: v.categoryName,
                products
            }))
        })

        allProducts = await Promise.all(fetchingProducts)

        if (allProducts.length === 0) {
            return errorMessage(res, 404, "Product Not Found", [])
        }
        return successMessage(res, "all products fetched successfully", allProducts)
    }
    catch (error) {
        return res.status(400).send({
            status: 0,
            error: error,
            message: "Internal Server Error"
        })
    }
})

export default router