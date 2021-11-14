import React, {useContext, useState} from 'react'
import {AuthContext} from '../../contexts/AuthContext'
import axios from 'axios'
import {Form, Button, Row, Col} from 'react-bootstrap'

const ForgotPassword=()=>{
	const [email, setEmail]=useState('')
	const [error, setError]=useState(null)
	const {message, dispatch}=useContext(AuthContext)
	
	const submitHandler=async e=>{
		e.preventDefault()
		try{
			const res=await axios.post('/api/auth/password/forgot', {email}, {
				headers:{'Content-Type': 'application/json'}
			})
			dispatch({type:'FORGOT_PASSWORD_SUCCESS', payload:res.data})
			setEmail('')
		}catch(err){
			console.log(err.response.data.message)
			setError('Something went wrong. Email has not been sent')
			setEmail('')
			setTimeout(()=>{setError('')}, 5000)
			clearTimeout()
		}
	}
	
	return(
		<Row>
			<Col md={12}>
				{message && (
					<h4 style={{fontSize:'12px', marginTop:'40px', color:'green'}}>{message}</h4>
				)}
				{error && (
					<h4 style={{fontSize:'12px', marginTop:'40px', color:'red'}}>{error}</h4>
				)}
				
				<h2 className='pass-h2'>Forgot Password</h2>
				<Form onSubmit={submitHandler}>
					
					<Form.Group controlId='email'>
						<Form.Label>Enter Email</Form.Label>
						<Form.Control type='email'
							placeholder='Enter Email'
							value={email}
							onChange={e=>setEmail(e.target.value)}
						>
						</Form.Control>
					</Form.Group>
					<Button type='submit' variant='primary'>
						Send Email
					</Button>
					
				</Form>
			</Col>
		</Row>
	)
}
export default ForgotPassword