import React, {useContext, useState} from 'react'
import {AuthContext} from '../../contexts/AuthContext'
import {Form, Button, Row, Col} from 'react-bootstrap'
import axios from 'axios'


const ResetPassword=({history, match})=>{
	const [password, setPassword]=useState('')
	const [confirmPassword, setConfirmPassword]=useState('')
	const [error, setError]=useState(null)
	const {dispatch}=useContext(AuthContext)
	const token=match.params.token

	
	const submitHandler=async e=>{
		e.preventDefault()
		if(password !== confirmPassword){
			setError('Passwords do not match')
			setPassword('')
			setConfirmPassword('')
			setTimeout(()=>{setError('')}, 5000)
			clearTimeout()
		}else{
			try{
				const res=await axios.put(`/api/auth/password/reset/${token}`, {password, confirmPassword}, {
					headers:{
					'Content-Type': 'application/json'
					}
				})
				dispatch({type:'NEW_PASSWORD_SUCCESS', payload:res.data})
				setPassword('')
				setConfirmPassword('')
				history.push('/login')
			}catch(err){
				//console.log(err.response.statusText)
				console.log(err.response.data.message)
				setError('Something went wrong. Password has not been reset')
				setTimeout(()=>{setError('')}, 5000)
				clearTimeout()
			}
		}
	}
	
	return(
		<Row>
			<Col md={12}>
				<h2>Reset Password</h2>		
				{error && (<h4 style={{fontSize:'12px',marginBottom:'30px',color:'red'}}>{error}</h4>)}
				<Form onSubmit={submitHandler}>

					<Form.Group controlId='password'>
						<Form.Label>Password</Form.Label>
						<Form.Control 
							type='password' placeholder='Enter Password'
							value={password} 
							onChange={e=>setPassword(e.target.value)}>
						</Form.Control>
					</Form.Group>				
				
					<Form.Group controlId='confirmPassword'>
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control 
							type='password' placeholder='Confirm Password'
							value={confirmPassword} 
							onChange={e=>setConfirmPassword(e.target.value)}>
						</Form.Control>
					</Form.Group>					
			
												
					<Button type='submit' variant='primary'>
						Send Password
					</Button>
				</Form>
			</Col>
		</Row>
	)
}
export default ResetPassword