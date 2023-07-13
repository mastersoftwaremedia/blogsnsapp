const asyncHandler=require('express-async-handler')
const User=require('../models/User')
const sendEmail=require('../utils/sendEmail')
const bcrypt=require('bcryptjs')
const crypto=require('crypto')
const cloudinary=require('cloudinary')
const ObjectId=require('mongoose').Types.ObjectId


//Register
const register=asyncHandler(async(req,res)=>{
	const result=await cloudinary.v2.uploader.upload(
		req.body.avatar, {
			folder:'avatars',
			width:150,
			crop:'scale'
	})
	//console.log(result)
	const {username, email, password}=req.body
	if(!username || !email || !password){
		res.status(400).json('Please fill in fields')
	}
	//console.log(username, email, password)
	const userExists=await User.findOne({email})
	if(userExists){
		res.status(400).json('Invalid credential info')
	}
	const user=await User.create({
		username, email, password,
		avatar:{
			public_id:result.public_id,
			url:result.secure_url
		}
	})
	/console.log(user)
	if(user){
		return res.status(200).json({
			...user._doc, token:user.generateToken(user._id)
		})
	}else{
		res.status(500).json('Invalid email or password register')
	}
})

//Login
const login=asyncHandler(async(req,res)=>{
	const {email, password}=req.body
	if(!email || !password){
		res.status(400).json('Please enter email or password')
	}
	try{
		const user=await User.findOne({email}).select('+password')
		if(user && (await user.comparePassword(password))){
			return res.status(200).json({
				...user._doc, token:user.generateToken(user._id)
			})
		}else{
			res.status(401).json('Invalid email or password login')
		}
	}catch(err){
		res.status(500).json(err)
	}
})

/////////////////////////////
const getUserProfile=asyncHandler(async(req,res)=>{
	const user=await User.findById(req.user._id).select('+password')
	if(user){
		res.status(200).json({...user._doc})
	}else{
		res.status(404).json('Current user not found')
	}
})

const updateUserProfile=asyncHandler(async(req,res)=>{
	const user=await User.findById(req.user._id).select('+password')
	if(user){
		user.email=req.body.email || user.email
		if(req.body.password){
			const salt=await bcrypt.genSalt(10)
			user.password=await bcrypt.hash(req.body.password, salt)
		}
		if(req.body.avatar !== ''){
			const image_id=user.avatar.public_id
			//const res=
			await cloudinary.v2.uploader.destroy(image_id)
			const result=await cloudinary.v2.uploader.upload(
			req.body.avatar, {
				folder:'avatars',
				width:150,
				crop:'scale'
			})
			user.avatar={
				public_id:result.public_id,
				url:result.secure_url
			}
		}
		const updatedUser=await User.findByIdAndUpdate(
			req.user._id, user, {
				new:true,
				runValidators:true,
				useFindAndModify:false
		})
		
		return res.status(200).json({
			...user._doc, token:user.generateToken(user._id)
		})
	}else{
		res.status(404).json('Current user not found')
	}
})

////////////////////////////
const forgotPassword=asyncHandler(async(req,res,next)=>{
	const {email}=req.body
	const user=await User.findOne({email})
	if(!user){
		res.status(404).json('User not found with this email')
	}
	const resetToken=user.getResetPasswordToken()
	await user.save({validateBeforeSave:false})
	
	const resetUrl=`${process.env.FRONTEND_URL}/password/reset/${resetToken}`
	const output=`
		<h2>You have a new reset token link</h2>
		<h3>Your password reset token is as follows:</h3>
		<p>${resetUrl}</p>
		
		<h4>If you have not requested this email, then ignore it.</h4>
	`
	try{
		await sendEmail({
			email:user.email,
			subject:'MyPost Blog Password Recovery',
			output
		})
		const message=`Please check your email : ${user.email}.`
		res.status(200).json({success:true, message:message})
	}catch(error){
		user.resetPasswordToken=undefined
		user.resetPasswordExpire=undefined
		await user.save({validateBeforeSave:false})
		return next(error)
	}
})
const resetPassword=asyncHandler(async(req,res)=>{
	const {email}=req.body
	const resetPasswordToken=crypto.createHash('sha256').update(req.params.token).digest('hex')
	const user=await User.findOne({
		resetPasswordToken,
		resetPasswordExpire:{$gt:Date.now()}
	})
	if(!user){
		res.status(400).json('Password reset token is invalid or has been expired')
	}
	if(req.body.password !== req.body.confirmPassword){
		res.status(400).json('Password does not match')
	}
	
	user.password=req.body.password
	user.resetPasswordToken=undefined
	user.resetPasswordExpire=undefined
	await user.save()
	res.status(200).json({success:true})
})

/////////////////////////////
module.exports={
	register, login, forgotPassword, resetPassword,
	getUserProfile, updateUserProfile
}
