const asyncHandler=require('express-async-handler')
const User=require('../models/User')
const Post=require('../models/Post')
const cloudinary=require('cloudinary')
const ObjectId=require('mongoose').Types.ObjectId


const getPosts=asyncHandler(async(req,res)=>{
	const pageSize=4
	const page=Number(req.query.pageNumber) || 1
	const keyword=req.query.keyword? {
		title:{
			$regex:req.query.keyword,
			$options:'i'
		}
	} : {}
	const count=await Post.countDocuments({...keyword})
	const posts=await Post.find({...keyword})
		.limit(pageSize)
		.skip(pageSize * (page - 1))
	//const posts=await Post.find()
	if(posts){
		res.status(200).json({
			posts, page, 
			pages:Math.ceil(count/pageSize)
		})
		//res.status(200).json(posts)
	}else{
		res.status(404).json('Posts not found')
	}
})

const getPost=asyncHandler(async(req,res)=>{
	try{
		const post=await Post.findById(req.params.id)
		res.status(200).json(post)
	}catch(err){
		res.status(500).json(err)
	}
})

const createPost=asyncHandler(async(req,res)=>{
	const result=await cloudinary.v2.uploader.upload(
		req.body.imageFileSet, {
			folder:'posts',
			width:500,
			crop:'scale'
	})
	const {title, description, postedBy, name}=req.body
	if(!title || !description){
		res.status(400).json('Please fill in fields')
	}
	
	const post=await Post.create({
		name, postedBy, title, description,
		imageFileSet:{
			public_id:result.public_id,
			url:result.secure_url
		}
	})
	if(post){
		res.status(200).json({success:true, post})
	}else{
		res.status(404).json('Post not created')
	}
})

const updatePost=asyncHandler(async(req,res)=>{
	if(ObjectId.isValid(req.params.id)){
		const post=await Post.findById(req.params.id)
		if(ObjectId.isValid(post.postedBy) === ObjectId.isValid(req.user._id)){
			if(post){
				post.title=req.body.title || post.title
				post.description=req.body.description || post.description
				
				if(req.body.imageFileSet !== ''){
					const image_id=post.imageFileSet.public_id
					await cloudinary.v2.uploader.destroy(image_id)
					const result=await cloudinary.v2.uploader.upload(req.body.imageFileSet, {
						folder:'posts',
						width:500,
						crop:'scale'
					})
					post.imageFileSet={
						public_id:result.public_id,
						url:result.secure_url
					}
				}
				
				const updatedPost=await Post.findByIdAndUpdate(req.params.id, post, {
					new:true,
					runValidators:true,
					useFindAndModify:false
				})
				res.status(200).json({success:true, message:'The post has been updated!'})
			}else{
				res.status(404).json('Post not found')
			}
		}else{
			res.status(403).json('You can update only your post!')
		}
	}else{
		res.status(404).json('Post not found with this ID')
	}
})

const deletePost=asyncHandler(async(req,res)=>{
	if(ObjectId.isValid(req.params.id)){
		const post=await Post.findById(req.params.id)
		if(ObjectId.isValid(post.postedBy)===ObjectId.isValid(req.user._id)){
			await post.deleteOne()
			res.status(200).json('The post has been deleted')
		}else{
			res.status(403).json('You can delete only your post')
		}
	}
})

const likePost=asyncHandler(async(req,res)=>{
	try{
		const post=await Post.findById(req.params.id)
		if(!post.likes.includes(req.body.userId)){
			await post.updateOne({$push:{likes:req.body.userId}})
			res.status(200).json('The post has been liked')
		}else{
			await post.updateOne({$pull:{likes:req.body.userId}})
			res.status(200).json('The post has been unliked')
		}
	}catch(err){
		res.status(500).json(err)
	}
})

const getMyPosts=asyncHandler(async(req,res)=>{
	try{
		const posts=await Post.find({postedBy:req.params.id})
		res.status(200).json(posts)
	}catch(err){
		res.status(500).json(err)
	}
})

module.exports={
	getPosts, getPost, createPost, updatePost, deletePost,
	likePost,
	getMyPosts
}