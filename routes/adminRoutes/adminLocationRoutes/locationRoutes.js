import express from 'express'
import addLocation from './addLocation.js'
import editLocation from './editLocation.js'
import deleteLocation from './deleteLocation.js'

const router = express.Router()

router.use(addLocation)
router.use(editLocation)
router.use(deleteLocation)

export default router