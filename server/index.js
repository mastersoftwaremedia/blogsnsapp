const express=require('express')
const cors=require('cors')
const path=require('path')
const dotenv=require('dotenv')
const morgan=require('morgan')
const fileUpload=require('express-fileupload')
const cloudinary=require('cloudinary')

const connectDB=require('./config/db')
const {notFound, errorHandler}=require('./middlewares/errorHandler')

const authRoute=require('./routes/authRoute')
const postsRoute=require('./routes/postsRoute')
const usersRoute=require('./routes/usersRoute')

dotenv.config()
connectDB()
cloudinary.config({
	cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
	api_key:process.env.CLOUDINARY_API_KEY,
	api_secret:process.env.CLOUDINARY_API_SECRET
})

const app=express()
if(process.env.NODE_ENV=='DEVELOPMENT'){
	app.use(morgan('dev'))
}
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(fileUpload())

//Define Routes
app.use('/api/auth', authRoute)
app.use('/api/users', usersRoute)
app.use('/api/posts', postsRoute)

//Serve static assets if in production
if(process.env.NODE_ENV=='PRODUCTION'){
	app.use(express.static(path.resolve(__dirname, "../client/build")))
	app.get("*", (req,res)=>{
		res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
	})
}else{
	app.get('/', (req,res)=>{
		res.send('API is running...')
	})
}

//Error Handler
app.use(notFound)
app.use(errorHandler)

//Setting port
const PORT=process.env.PORT || 5000
app.listen(PORT, ()=>console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`))