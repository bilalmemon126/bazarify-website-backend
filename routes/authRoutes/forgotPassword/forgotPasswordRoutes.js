import express from 'express'
import resetPasswordProtectedRoute from './resetPasswordProtectedRoute.js'
import forgotPassword from './forgotPassword.js'
import verifyOtp from './verifyOtp.js'
import resetPassword from './resetPassword.js'

const router = express.Router()

router.use(resetPasswordProtectedRoute)
router.use(forgotPassword)
router.use(verifyOtp)
router.use(resetPassword)

export default router