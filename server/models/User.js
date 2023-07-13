const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const validator=require('validator')
const crypto=require('crypto')

const userSchema=new mongoose.Schema({
	username:{
		type:String,
		required:[true, 'Username is required'],
		minLength:[3, 'Username must not be less than 3 characters'],
		maxLength:[20, 'Username cannot exceed 20 characters']
		//trim:true,
		//unique:true
	},
	email:{
		type:String,
		required:[true, 'Email is required'],
		//maxLength:[30, 'Email cannot exceed 30 characters'],
		validate:[validator.isEmail, 'Please enter valid email address'],
		unique:true
	},
	password:{
		type:String,
		required:[true, 'Password is required'],
		minLength:[6, 'Your password must be longer than 5 characters'],
		select:false
	},
	avatar:{
		public_id:{type:String, required:true},
		url:{type:String, required:true}
	},
	followers:{type:Array, default:[]},
	followings:{type:Array, default:[]},
	createdAt:{type:Date, default:Date.now},
	resetPasswordToken:String,
	resetPasswordExpire:Date
}, {timestamps:true})


userSchema.pre('save', async function(next){
	if(!this.isModified('password')){
		return next()
	}
	const salt=await bcrypt.genSalt(10)
	this.password=await bcrypt.hash(this.password, salt)
})
userSchema.methods.comparePassword=async function(enteredPassword){
	return await bcrypt.compare(enteredPassword, this.password)
}
userSchema.methods.generateToken=function(){
	return jwt.sign({id:this._id}, process.env.JWT_SECRET, {
		expiresIn:process.env.JWT_EXPIRES_TIME
	})
}
userSchema.methods.getResetPasswordToken=function(){
	const resetToken=crypto.randomBytes(20).toString('hex')
	this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex')
	this.resetPasswordExpire=Date.now() + 30 * 60 * 1000
	return resetToken
}
module.exports=mongoose.model('User', userSchema)
