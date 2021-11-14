const mongoose=require('mongoose')
const validator=require('validator')

const postSchema=new mongoose.Schema({
	postedBy:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'User'
	},
	name:{type:String},
	title:{
		type:String,
		required:[true, 'Title is required'],
		trim:true
	},
	description:{
		type:String,
		required:[true, 'Description is required']
	},
	imageFileSet:{
		public_id:{type:String, required:true},
		url:{type:String, required:true}
	},
	likes:{type:Array, default:[]},
	publishedAt:{type:Date, default:Date.now},
	updatedAt:Date
}, {timestamps:true})
module.exports=mongoose.model('Post', postSchema)