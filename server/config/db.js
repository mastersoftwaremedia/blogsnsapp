const mongoose=require('mongoose')

const connectDB=async()=>{
	try{
		const conn=await mongoose.connect(
		process.env.DB_URI, {
		//process.env.DB_LOCAL_URI, {
			useNewUrlParser:true,
			//useCreateIndex:true,
			useUnifiedTopology:true,
			//useFindAndModify:false
		})
		console.log(`DB connected: ${conn.connection.host}`)
	}catch(error){
		console.log(`Error: ${error.message}`)
		process.exit(1)
	}
}
module.exports=connectDB