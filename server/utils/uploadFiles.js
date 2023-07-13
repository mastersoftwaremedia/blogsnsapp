const express=require('express')
const router=express.Router()
const path=require('path')
const multer=require('multer')
const {verify, admin}=require('../middlewares/authMiddleware')

const storage=multer.diskStorage({
	destination(req,file,cb){
		cb(null, 'uploads/')
	},
	filename(req,file,cb){
		cb(
			null, 
			`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
		)
	}
})

function checkFileType(file, cb){
	const filetypes= /jpg|jpeg|png|gif/
	const extname=filetypes.test(path.extname(file.originalname).toLowerCase())
	const mimetype= filetypes.test(file.mimetype)
	if(extname && mimetype){
		return cb(null, true)
	}else{
		cb('Images only!')
	}
}

const upload=multer({
	storage,
	fileFilter:function(req,file,cb){
		checkFileType(file, cb)
	}
})
/*
router.post('/', verify, admin, upload.single('image'), (req,res)=>{
	res.send(`/${req.file.path}`)
})
*/

module.exports=upload
