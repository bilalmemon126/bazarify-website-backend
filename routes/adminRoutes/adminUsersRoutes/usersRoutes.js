import express from 'express'
import adminGetUsersRoute from './getUsers.js'
import adminEditUsersRoute from './editUsers.js'

const router = express.Router()

router.use(adminGetUsersRoute)
router.use(adminEditUsersRoute)

export default router