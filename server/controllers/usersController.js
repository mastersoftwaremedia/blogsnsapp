const asyncHandler=require('express-async-handler')
const User=require('../models/User')
const ObjectId=require('mongoose').Types.ObjectId

const getUsers=asyncHandler(async(req,res)=>{
	const pageSize=4
	const userPage=Number(req.query.userPageNumber) || 1
	const keyword=req.query.keyword? {
		username:{
			$regex:req.query.keyword,
			$options:'i'
		}
	} : {}
	const count=await User.countDocuments({...keyword})
	const users=await User.find({...keyword})
		.limit(pageSize)
		.skip(pageSize * (userPage - 1))
	if(users){
		res.status(200).json({
			users, userPage,
			userPages:Math.ceil(count/pageSize)
		})
	}else{
		res.status(404).json('Users not found')
	}
})

const getUser=asyncHandler(async(req,res)=>{
	const user=await User.findById(req.params.id).select('-password')
	if(user){
		res.status(200).json(user)
	}else{
		res.status(404).json('User not found')
	}
})
///////////////////////////
const getMyFriends=asyncHandler(async(req,res)=>{
	if(ObjectId.isValid(req.params.id)){
		try{
			const user=await User.findById(req.params.id)
			const friends=await Promise.all(
				user.followings.map(friendId=>{
					return User.findById(friendId)
				})
			)
			let friendList=[]
			friends.map(friend=>{
				const {_id, username, avatar}=friend
				friendList.push({_id, username, avatar})
			})
			res.status(200).json(friendList)
		}catch(err){
			res.status(500).json(err)
		}
	}else{
		res.status(404).json('User not found with this ID')
	}
})

//follow a user
const followUser=asyncHandler(async(req,res)=>{
	if(req.body.userId !== req.params.id){
		try{
			const user=await User.findById(req.params.id)
			const currentUser=await User.findById(req.body.userId)
			if(!user.followers.includes(req.body.userId)){
				await user.updateOne({$push:{followers:req.body.userId}})
				await currentUser.updateOne({$push:{followings:req.params.id}})
				res.status(200).json('User has a follower!')
			}else{
				res.status(403).json('You already follow this person')
			}
		}catch(err){
			res.status(500).json(err)
		}
	}else{
		res.status(403).json('You cannot follow yourself')
	}
})
//unfollow a user
const unfollowUser=asyncHandler(async(req,res)=>{
	if(req.body.userId !== req.params.id){
		try{
			const user=await User.findById(req.params.id)
			const currentUser=await User.findById(req.body.userId)
			if(user.followers.includes(req.body.userId)){
				await user.updateOne({$pull:{followers:req.body.userId}})
				await currentUser.updateOne({$pull:{followings:req.params.id}})
				res.status(200).json('User has been unfollowed!')
			}else{
				res.status(403).json('You are already not following this user!')
			}
		}catch(err){
			res.status(500).json(err)
		}
	}else{
		res.status(403).json('You cannot unfollow yourself')
	}
})

module.exports={
	getUsers, getUser, 
	getMyFriends,
	followUser, unfollowUser
}