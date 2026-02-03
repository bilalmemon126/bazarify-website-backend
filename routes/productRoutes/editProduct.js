import express from 'express'
import { upload } from '../../config/multer.js'
import { ObjectId } from 'mongodb'
import cloudinary from '../../config/cloudinary.js'
import { User } from '../../models/user.model.js'
import { Product } from '../../models/product.model.js'
const router = express.Router()

router.put('/product/:productId/:userId', upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 8 }
]), async (req, res) => {
    try {
        let productId = new ObjectId(req.params.productId)
        let userId = new ObjectId(req.params.userId)
        let checkUser = await User.findOne({ _id: userId })
        let findProducts = await Product.findOne({ _id: productId })

        let category = findProducts.category
        if (checkUser) {
            if (findProducts) {
                if (findProducts.createdBy.equals(userId)) {
                    if (!req.files.mainImage && !req.body.mainImage || !req.files.images && !req.body.images || !req.body.title || !req.body.description || !req.body.price || !req.body.status || !req.body.location) {
                        return res.status(400).send({
                            status: 0,
                            message: "all fields are required"
                        })
                    }
                    else {
                        let products = {}
                        let mainImageResult = null;
                        let imagesResult = null;

                        if (req.body.mainImage) {
                            mainImageResult = JSON.parse(req.body.mainImage)
                        }

                        if (req.body.images) {
                            let imagesUpload = req.body.images

                            imagesResult = imagesUpload.map((v, i) => {
                                return JSON.parse(v)
                            })
                        }

                        if (req.files.mainImage) {
                            cloudinary.uploader.destroy(findProducts.mainImage.public_id)
                                .then(result => {
                                    return console.log(result)
                                })

                            mainImageResult = await cloudinary.uploader
                                .upload(req.files.mainImage[0].path, {
                                    folder: "products"
                                })
                                .then(result => {
                                    return ({
                                        public_id: result.public_id,
                                        secure_url: result.secure_url
                                    })
                                })
                        }

                        let getImages = req.files.images
                        if (getImages) {
                            findProducts.images.map((v, i) => {
                                return cloudinary.uploader.destroy(v.public_id)
                                    .then(result => {
                                        return console.log(result)
                                    })
                            })

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
                            imagesResult = result
                        }

                        if (category == "bike" || category == "car") {
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
                                category: category,
                                status: req.body.status,
                                isBlocked: req.body.isBlocked || false,
                                condition: req.body.condition,
                                isFavourite: [],
                                location: req.body.location,
                                createdAt: Date.now(),
                                createdBy: userId
                            }
                        }
                        if (category == "mobile" || category == "tablet" || category == "electronics" || category == "furniture") {
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
                                category: category,
                                status: req.body.status,
                                isBlocked: req.body.isBlocked || false,
                                condition: req.body.condition,
                                isFavourite: [],
                                location: req.body.location,
                                createdAt: Date.now(),
                                createdBy: userId
                            }
                        }

                        if (category == "house") {
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
                                category: category,
                                status: req.body.status,
                                isBlocked: req.body.isBlocked || false,
                                condition: req.body.condition,
                                isFavourite: [],
                                location: req.body.location,
                                createdAt: Date.now(),
                                createdBy: userId
                            }
                        }

                        if (category == "fashion") {
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
                                category: category,
                                status: req.body.status,
                                isBlocked: req.body.isBlocked || false,
                                condition: req.body.condition,
                                isFavourite: [],
                                gender: req.body.gender,
                                location: req.body.location,
                                createdAt: Date.now(),
                                createdBy: userId
                            }
                        }
                        if (category != "bike" && category != "car" && category != "mobile" && category != "tablet" && category != "electronics" && category != "furniture" && category != "house" && category != "fashion") {
                            products = {
                                mainImage: mainImageResult,
                                images: imagesResult,
                                title: req.body.title,
                                description: req.body.description,
                                price: req.body.price,
                                category: category,
                                status: req.body.status,
                                isBlocked: req.body.isBlocked || false,
                                condition: req.body.condition,
                                isFavourite: [],
                                location: req.body.location,
                                createdAt: Date.now(),
                                createdBy: userId
                            }
                        }
                        let updateProduct = await Product.updateOne(
                            { _id: productId },
                            { $set: products },
                            {}
                        )
                        if (updateProduct) {
                            return res.send({
                                status: 1,
                                message: "Product Updated Successfully"
                            })
                        }
                        else {
                            return res.send({
                                status: 0,
                                message: "Something Went Wrong"
                            })
                        }
                    }
                }
                else {
                    return res.send({
                        status: 0,
                        message: "something went wrong"
                    })
                }
            }
            else {
                return res.send({
                    status: 0,
                    message: "Product Not Found"
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