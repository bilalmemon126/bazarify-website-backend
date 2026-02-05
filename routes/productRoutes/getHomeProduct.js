import express from 'express'
import { Product } from '../../models/product.model.js'
import { Category } from '../../models/category.model.js'
const router = express.Router()


router.get('/product/home', async (req, res) => {
    try {
        let filter = {}

        // if(req.query.search){
        //     filter.$text = {$search: req.query.search}
        // }

        let findCategory = await Category.find({ alsoForHome: true })

        let allProducts = []
        if (!findCategory) {
            return res.send({
                status: 0,
                message: "something went wrong",
                data: []
            })
        }

        if(req.query.location){
            filter.location = req.query.location
        }
        
        
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
            return res.send({
                status: 0,
                message: "Product Not Found",
                data: []
            })
        }
        return res.send({
            status: 1,
            message: "all products fetched successfully",
            data: allProducts
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