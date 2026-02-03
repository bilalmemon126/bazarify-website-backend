import express from 'express'
import adminLoginRoute from './adminAuthRoutes/adminLogin.js'
import adminProtectedRoute from './adminAuthRoutes/adminProtectedRoute.js'
import adminProductsRoutes from './adminProductsRoutes/productsRoutes.js'
import adminUsersRoutes from './adminUsersRoutes/usersRoutes.js'
import adminCategoryRoutes from './adminCategoryRoutes/categoryRoutes.js'
import adminLocationRoutes from './adminLocationRoutes/locationRoutes.js'
import adminLogoutRoute from './adminAuthRoutes/adminLogout.js'

const router = express.Router()

router.use("/admin", adminLoginRoute)

router.use("/admin", adminProtectedRoute)

router.use("/admin", adminProductsRoutes)
router.use("/admin", adminUsersRoutes)
router.use("/admin", adminCategoryRoutes)
router.use("/admin", adminLocationRoutes)
router.use("/admin", adminLogoutRoute)

export default router