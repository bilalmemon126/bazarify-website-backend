import express from 'express'
import addFavouriteRoute from './addFavourite.js'
import getFavouriteRoute from './getFavourite.js'

const router = express.Router()

router.use(addFavouriteRoute)
router.use(getFavouriteRoute)

export default router