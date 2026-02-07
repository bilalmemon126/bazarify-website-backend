import express from 'express'
import { Product } from '../../models/product.model.js'
import { Category } from '../../models/category.model.js'
const router = express.Router()


router.get('/product', async (req, res) => {
    try {
        let filter = {}
        let sort = {createdAt: -1}
        let projection ={}

        if(req.query.search){
            filter.$text = {$search: req.query.search}
            sort = {score: {$meta: "textScore"}}
            projection.score = {$meta: "textScore"}
        }
        console.log(req.query.search)

        if(req.query.category){
            let findCategory = await Category.findOne({categoryName: req.query.category})
            if(!findCategory){
                return res.status(400).send({
                    status: 0,
                    message: "category not found"
                })
            }
            filter.category = findCategory._id
        }

        if(req.query.location){
            filter.location = req.query.location
        }

        if(req.query.userId){
            filter.createdBy = req.query.userId
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

        filter.isBlocked = false

        if(req.query.sort === "lowestPrice"){
            sort = {price: 1}
        }

        if(req.query.sort === "highestPrice"){
            sort = {price: -1}
        }
        
        let findProducts = await Product.find(filter, projection)
        .sort(sort)
        .populate("category createdBy location")

        if (findProducts.length === 0) {
            return res.send({
                status: 0,
                message: "Product Not Found",
                data: []
            })
        }

        return res.send({
            status: 1,
            message: "all products fetched successfully",
            data: findProducts
        })
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