import express from 'express'
import { upload } from '../../config/multer.js'
import { ObjectId } from 'mongodb'
import cloudinary from '../../config/cloudinary.js'
import { User } from '../../models/user.model.js'
import { Product } from '../../models/product.model.js'
import { Category } from '../../models/category.model.js'
const router = express.Router()


router.post('/product/:userId', upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 8 }
]), async (req, res) => {
    try {
        let userId = new ObjectId(req.params.userId)
        let checkUser = await User.findOne({ _id: userId })
        if (checkUser) {
            if (!req.files.mainImage || !req.files.images || !req.body.title || !req.body.description || !req.body.price || !req.body.location) {
                return res.status(400).send({
                    status: 0,
                    message: "all fields are required"
                })
            }
            let categoryName = req.body.category

            let checkCategory = await Category.findOne({categoryName: categoryName})
            
            if(!checkCategory){
                return res.status(400).send({
                    status: 0,
                    message: `this category name ${categoryName} does not exist`
                })
            }
            let products = {}

            let mainImageResult = await cloudinary.uploader
                .upload(req.files.mainImage[0].path, {
                    folder: "products"
                })
                .then(result => {
                    return ({
                        public_id: result.public_id,
                        secure_url: result.secure_url
                    })
                })

            let getImages = req.files.images
            let imagesUpload = getImages.map((v, i) => {
                return cloudinary.uploader
                    .upload(v.path, {
                        folder: "products"
                    })
                    .then(result => {
                        return ({
                            public_id: result.public_id,
                            secure_url: result.secure_url
                        })
                    })

            })

            let result = await Promise.all(imagesUpload)
            let imagesResult = result

            if (categoryName == "bike" || categoryName == "car") {
                if (!req.body.make) {
                    return res.status(400).send({
                        status: 0,
                        message: "all fields are required"
                    })
                }

                products = {
                    mainImage: mainImageResult,
                    images: imagesResult,
                    title: req.body.title,
                    description: req.body.description,
                    make: req.body.make,
                    price: req.body.price,
                    category: checkCategory._id,
                    isBlocked: false,
                    condition: req.body.condition,
                    location: req.body.location,
                    createdAt: Date.now(),
                    createdBy: userId
                }
            }
            if (categoryName == "mobile" || categoryName == "tablet" || categoryName == "electronics" || categoryName == "furniture") {
                if (!req.body.brand) {
                    return res.status(400).send({
                        status: 0,
                        message: "all fields are required"
                    })
                }
                products = {
                    mainImage: mainImageResult,
                    images: imagesResult,
                    title: req.body.title,
                    description: req.body.description,
                    brand: req.body.brand,
                    price: req.body.price,
                    category: checkCategory._id,
                    isBlocked: false,
                    condition: req.body.condition,
                    location: req.body.location,
                    createdAt: Date.now(),
                    createdBy: userId
                }
            }

            if (categoryName == "house") {
                if (!req.body.bedrooms || !req.body.bathrooms || !req.body.areaUnit || !req.body.area) {
                    return res.status(400).send({
                        status: 0,
                        message: "all fields are required"
                    })
                }
                products = {
                    mainImage: mainImageResult,
                    images: imagesResult,
                    title: req.body.title,
                    description: req.body.description,
                    bedrooms: req.body.bedrooms,
                    bathrooms: req.body.bathrooms,
                    areaUnit: req.body.areaUnit,
                    area: req.body.area,
                    price: req.body.price,
                    category: checkCategory._id,
                    isBlocked: false,
                    condition: req.body.condition,
                    location: req.body.location,
                    createdAt: Date.now(),
                    createdBy: userId
                }
            }

            if (categoryName == "fashion") {
                if (!req.body.brand || !req.body.fabric || !req.body.gender) {
                    return res.status(400).send({
                        status: 0,
                        message: "all fields are required"
                    })
                }
                products = {
                    mainImage: mainImageResult,
                    images: imagesResult,
                    title: req.body.title,
                    description: req.body.description,
                    brand: req.body.brand,
                    fabric: req.body.fabric,
                    price: req.body.price,
                    category: checkCategory._id,
                    isBlocked: false,
                    condition: req.body.condition,
                    gender: req.body.gender,
                    location: req.body.location,
                    createdAt: Date.now(),
                    createdBy: userId
                }
            }
            if (categoryName != "bike" && categoryName != "car" && categoryName != "mobile" && categoryName != "tablet" && categoryName != "electronics" && categoryName != "furniture" && categoryName != "house" && categoryName != "fashion") {
                products = {
                    mainImage: mainImageResult,
                    images: imagesResult,
                    title: req.body.title,
                    description: req.body.description,
                    price: req.body.price,
                    category: checkCategory._id,
                    isBlocked: false,
                    condition: req.body.condition,
                    location: req.body.location,
                    createdAt: Date.now(),
                    createdBy: userId
                }
            }

            let insert = await Product.create(products)
            if (insert) {
                return res.status(200).send({
                    status: 1,
                    message: "inserted successfully"
                })
            }
            else {
                return res.send({
                    status: 0,
                    message: "Something Went Wrong"
                })
            }
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
            message: "Internal Server Error"
        })
    }
})


export default router