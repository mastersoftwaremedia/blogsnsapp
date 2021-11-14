const express=require('express')
const router=express.Router()
const {
	getPosts, getPost, 
	createPost, updatePost, deletePost,
	likePost, getMyPosts
}=require('../controllers/postsController')
const verify=require('../middlewares/authMiddleware')

//http://localhost:5000/api/posts
router.get('/', getPosts)
router.post('/', verify, createPost)
router.get('/:id', verify, getPost)
router.put('/:id', verify, updatePost)
router.delete('/:id', verify, deletePost)

router.put('/:id/like', verify, likePost)
router.get('/myposts/:id', verify, getMyPosts)

module.exports=router