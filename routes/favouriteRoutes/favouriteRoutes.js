import express from 'express'
import addFavouriteRoute from './addFavourite.js'
import getFavouriteRoute from './getFavourite.js'

const router = express.Router()

router.use("/favourite", addFavouriteRoute)
router.use("/favourite", getFavouriteRoute)

export default router