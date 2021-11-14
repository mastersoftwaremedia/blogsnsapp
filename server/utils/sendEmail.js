const nodemailer=require('nodemailer')
const sendgridTransport=require('nodemailer-sendgrid-transport')

const sendEmail=async options=>{
	const transporter=nodemailer.createTransport(
		sendgridTransport({
			auth:{api_key:process.env.SENDGRID_API}
		})
	)
	const message={
		from: process.env.EMAIL,
		to: options.email,
		subject: options.subject,
		html: options.output
	}
	await transporter.sendEmail(message, (err, resp)=>{
		if(err){
			console.log(err)
		}else{
			console.log(resp)
		}
	})
}
module.exports=sendEmail