import React, {useState} from 'react'
import axios from 'axios'
import {Link, useHistory} from 'react-router-dom'
import {Form, Figure, Button, Row, Col} from 'react-bootstrap'
import FormContainer from '../layout/FormContainer'


const Register=()=>{
	const [username, setUsername]=useState('')
	const [email, setEmail]=useState('')
	const [password, setPassword]=useState('')
	const [confirmPassword, setConfirmPassword]=useState('')
	const [avatar, setAvatar]=useState('')
	const [avatarPreview, setAvatarPreview]=useState('/images/default_avatar.jpg')
	const [error, setError]=useState(null)
	const history=useHistory()

	
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
				const formData=new FormData()
				formData.set('username', username)
				formData.set('email', email)
				formData.set('password', password)
				formData.set('avatar', avatar)
			
				const res=await axios.post('/api/auth/register', formData, {
					headers:{
						Accept:'application/json',
						'Content-Type': 'multipart/form-data',
					}
				})
				console.log('success', res.data.success)
				setUsername('')
				setEmail('')
				setPassword('')
				setConfirmPassword('')
				setAvatar('')
				setAvatarPreview('/images/default_avatar.jpg')
				history.push('/login')
			}catch(err){
				console.log(err.response.data.message)
				setError('Something went wrong. You are NOT registered')
				setTimeout(()=>{setError('')}, 5000)
				clearTimeout()
			}
		}
	}
	
	const onFileSelected=e=>{
		if(e.target.name==='avatar'){
			console.log(e.target.files[0])
			const reader=new FileReader()
			reader.onload=()=>{
				if(reader.readyState===2){
					setAvatarPreview(reader.result)
					setAvatar(reader.result)
				}
			}
			reader.readAsDataURL(e.target.files[0])
		}
	}
	
	return (
		<FormContainer>
			<h1 className='auth-h1'>Sign Up</h1>
			{error && (<h4 style={{fontSize:'12px',marginBottom:'30px',color:'red'}}>{error}</h4>)}
			<Form onSubmit={submitHandler}>
			 
				<Form.Group controlId='username'>
					<Form.Label>Username</Form.Label>
					<Form.Control type='text' placeholder='Enter Username'
					value={username} onChange={e=>setUsername(e.target.value)}
					required>
					</Form.Control>
					<span style={{fontSize:'10px'}}>Username should be unique</span>
				</Form.Group>
				
				<Form.Group controlId='email'>
					<Form.Label>Email</Form.Label>
					<Form.Control type='email' placeholder='Enter Email'
					value={email} onChange={e=>setEmail(e.target.value)}
					required>
					</Form.Control>
				</Form.Group>		

				<Form.Group controlId='password'>
					<Form.Label>Password</Form.Label>
					<Form.Control type='password' placeholder='Enter Password'
					value={password} onChange={e=>setPassword(e.target.value)}
					required minLength='6'>
					</Form.Control>
					<span style={{fontSize:'10px'}}>Password must be more then 6 characters</span>
				</Form.Group>				
				
				<Form.Group controlId='confirmPassword'>
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control type='password' placeholder='Confirm Password'
					value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required minLength='6'>
					</Form.Control>
				</Form.Group>
				
				<Form.Group controlId='avatar' style={{marginBottom:'20px'}}>
					<Figure>
						<Figure.Image
							alt="Avatar Preview"
							src={avatarPreview}
							width={160} height={150}
							roundedCircle
						/>
					</Figure>												
					<Form.File name='avatar' 
						custom
						label='Choose Avatar'
						accept='images/*'
						onChange={onFileSelected}
					>
					</Form.File>
					<span style={{fontSize:'10px'}}>Please select an avatar to be registered</span>
				</Form.Group>					
				
				
				<div className="d-grid gap-2">
					<Button type='submit' variant='primary'>
						Register
					</Button>
				</div>
			</Form>
			
			<Row className='py-3'>
				<Col>
					Already Joined?{' '}
					<Link to='/login' style={{textDecoration:'none'}}>Login</Link>
				</Col>
			</Row>
		</FormContainer>
	)
}
export default Register