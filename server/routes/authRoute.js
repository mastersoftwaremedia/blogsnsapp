const express=require('express')
const router=express.Router()
const {
	register, login, forgotPassword, resetPassword,
	getUserProfile, updateUserProfile
}=require('../controllers/authController')
const verify=require('../middlewares/authMiddleware')

//http://localhost:5000/api/auth
router.post('/register', register)
router.post('/login', login)

router.post('/password/forgot', forgotPassword)
router.put('/password/reset/:token', resetPassword)

router.get('/profile', verify, getUserProfile)
router.put('/profile', verify, updateUserProfile)

module.exports=router