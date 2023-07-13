import React, {useContext, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {Row, Col, Form, Figure, Button} from 'react-bootstrap'
import {AuthContext} from '../../contexts/AuthContext'
import axios from 'axios'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'


const MyProfileEdit=({history})=>{
	const [email, setEmail]=useState('')
	const [password, setPassword]=useState('')
	const [confirmPassword, setConfirmPassword]=useState('')
	const [avatar, setAvatar]=useState('')
	const	[avatarPreview, setAvatarPreview]=useState('')
	const [error, setError]=useState(null)

	const {user, token, dispatch}=useContext(AuthContext)
	const id=user._id


	useEffect(()=>{
		if(!user.username){	
			const getUserDetails=async id=>{
				try{
					await axios.get(`/api/auth/${id}`, {
						headers:{
							Authorization: `Bearer ${token}`						
						}
					})
				}catch(err){
					console.log(err)
				}
			}
			getUserDetails('profile')
		}else{
			setEmail(user.email)
			setAvatarPreview(user.avatar.url)
		}
	},[id, token, user.username, user.email, user.avatar.url])

	
	const submitHandler=async e=>{
		e.preventDefault()
		if(password !== confirmPassword){
			setError('Passwords do not match')
			setPassword('')
			setConfirmPassword('')
			setTimeout(()=>{setError('')}, 5000)
		}else{
			try{
				const formData=new FormData()
				formData.set('email', email)
				formData.set('password', password)
				formData.set('avatar', avatar)
							
				const res=await axios.put('/api/auth/profile', formData, {
					headers:{
						Accept:'application/json',
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${token}`
					}
				})
				dispatch({type:'PROFILE_UPDATE_SUCCESS', payload:res.data})
			}catch(err){
				//console.log(err.response.statusText)		
				console.log(err.response.data.message)		
				setError('Profile has not been updated')
				setPassword('')
				setConfirmPassword('')
				setTimeout(()=>{setError('')}, 5000)				
			}
		}
	}

	const onFileSelected=e=>{
		const reader=new FileReader()
		reader.onload=()=>{
			if(reader.readyState===2){
				setAvatarPreview(reader.result)
				setAvatar(reader.result)
			}
		}
		reader.readAsDataURL(e.target.files[0])
	}	
	
	return(
		<>
			<Link to='/myprofile' className='btn btn-light my-3'>Go Back</Link>
			<Row>
				<Col md={12}>
				{error && (<h4 style={{fontSize:'12px', marginBottom:'30px', color:'red'}}>{error}</h4>)}
					
					<div className='d-flex justify-content-space align-items-center'>
						<h2>User Profile : </h2>
						<h3 style={{paddingLeft:'10px'}}>{user.username}</h3>
					</div>


					<Form onSubmit={submitHandler} 
					encType='multipart/form-data'
					className='mb-3 mt-3'>
						
						<Form.Group controlId='email' className='mb-3 mt-3'>
							<Form.Label>Email</Form.Label>
							<Form.Control type='email' 
								placeholder='Enter Email'
								value={email}
								onChange={e=>setEmail(e.target.value)}
							>							
							</Form.Control>
						</Form.Group>						
							
						<Form.Group controlId='password' className='mb-3 mt-3'>
							<Form.Label>Password</Form.Label>
							<Form.Control type='password' 
								placeholder='Enter Password'
								value={password}
								onChange={e=>setPassword(e.target.value)}
							>							
							</Form.Control>
						</Form.Group>
						
						<Form.Group controlId='confirmPassword' className='mb-3 mt-3'>
							<Form.Label>Confirm Password</Form.Label>
							<Form.Control type='password' 
								placeholder='Confirm Password'
								value={confirmPassword}
								onChange={e=>setConfirmPassword(e.target.value)}
							>							
							</Form.Control>
						</Form.Group>
						
						<Form.Group controlId='avatar' className='mb-3 mt-3'>
						{setAvatarPreview? (
							<Figure>
								<Figure.Image 
									alt='Avatar Preview'
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
						</Form.Group>
						
						<Button type='submit' variant='primary'>
							Update Profile
						</Button>
					</Form>

			</Col>
		</Row>
	</>
	)
}
export default MyProfileEdit