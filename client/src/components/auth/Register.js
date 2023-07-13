import React, {useState} from 'react'
import axios from 'axios'
import {Link, useHistory} from 'react-router-dom'
import {Form, Figure, Button, Row, Col} from 'react-bootstrap'
import FormContainer from '../layout/FormContainer'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'


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
						//Accept:'application/json',
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
				//console.log(err.response.statusText)
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
			
			<Form onSubmit={submitHandler}
				encType='multipart/form-data' 
				className='mb-3 mt-3'			
			>
			 
				<Form.Group controlId='username' className='mb-3 mt-3'>
					<Form.Label>Username</Form.Label>
					<Form.Control type='text' placeholder='Enter Username'
					value={username} onChange={e=>setUsername(e.target.value)}
					required>
					</Form.Control>
					<span style={{fontSize:'10px'}}>Username should be unique</span>
				</Form.Group>
				
				<Form.Group controlId='email' className='mb-3 mt-3'>
					<Form.Label>Email</Form.Label>
					<Form.Control type='email' placeholder='Enter Email'
					value={email} onChange={e=>setEmail(e.target.value)}
					required>
					</Form.Control>
				</Form.Group>		

				<Form.Group controlId='password' className='mb-3 mt-3'>
					<Form.Label>Password</Form.Label>
					<Form.Control type='password' placeholder='Enter Password'
					value={password} onChange={e=>setPassword(e.target.value)}
					required minLength='6'>
					</Form.Control>
					<span style={{fontSize:'10px'}}>Password must be more then 6 characters</span>
				</Form.Group>				
				
				<Form.Group controlId='confirmPassword' className='mb-3 mt-3'>
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control type='password' placeholder='Confirm Password'
					value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required minLength='6'>
					</Form.Control>
				</Form.Group>
				
				<Form.Group controlId='avatar' className='mb-3 mt-3'>
				{setAvatarPreview? (
					<Figure>
						<Figure.Image
							alt="Avatar Preview"
							src={avatarPreview}
							width={200} height={200}
							roundedCircle
						/>
					</Figure>		
				) : (
					<Figure>
						<Figure.Image 
							alt='Avatar Preview'
							src='/images/default_avatar.jpg'
							width={200} height={200}
							roundedCircle
						/>
					</Figure>				
				)}
				
				<Form.Label className='imgLabel'>
					<AddPhotoAlternateIcon style={{marginTop:'10px', width:'60px', height:'60px'}} />
					Chooase Avatar
				</Form.Label>
				{avatarPreview && (
					<Form.Control 
						type='file'
						name='avatar' 
						accept='images/*'
						onChange={onFileSelected}
						style={{marginTop:'-30px'}}
				/>)}
					<div style={{fontSize:'10px'}}>Please select an avatar to be registered
					</div>
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
