const express=require('express')
const router=express.Router()
const {
	getUsers, getUser, 
	getMyFriends,
	followUser, unfollowUser
}=require('../controllers/usersController')
const verify=require('../middlewares/authMiddleware')

//http://localhost:5000/api/users
router.get('/', getUsers)

router.put('/:id/follow', followUser)
router.put('/:id/unfollow', unfollowUser)

router.get('/:id', verify, getUser)

router.get('/friends/:id', getMyFriends)

module.exports=router