import express from 'express'
import loginRoute from './login.js'
import registrationRoute from './resgistration.js'
import otpVerificationRoute from './otpVerification.js'
import forgotPasswordRoutes from './forgotPassword/forgotPasswordRoutes.js'
import protectedRoute from './protectedRoute.js'
import logoutRoute from './logout.js'

const router = express.Router()

router.use(loginRoute)
router.use(registrationRoute)
router.use(otpVerificationRoute)
router.use(forgotPasswordRoutes)
router.use(protectedRoute)
router.use(logoutRoute)

export default router