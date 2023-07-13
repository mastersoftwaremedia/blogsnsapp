import React, {useState, useContext} from 'react'
import {Link} from 'react-router-dom'
import {Row, Form, Figure, Button} from 'react-bootstrap'
import {AuthContext} from '../../contexts/AuthContext'
import FormContainer from '../layout/FormContainer'
import axios from 'axios'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'


const PostNew=()=>{
	const [title, setTitle]=useState('')
	const [description, setDescription]=useState('')
	const [imageFileSet, setImageFileSet]=useState('')
	const [imageFileSetPreview, setImageFileSetPreview]=useState('/images/img_notFound.png')
	const [message, setMessage]=useState(null)
	const [error, setError]=useState(false)
	const {user, token}=useContext(AuthContext)

	
	const submitHanlder=async(e)=>{
		e.preventDefault()
		try{
			const postedBy=user._id
			const name=user.username
			const formData=new FormData()
			formData.set('postedBy', postedBy)
			formData.set('name', name)
			formData.set('title', title)
			formData.set('description', description)
			formData.set('imageFileSet', imageFileSet)
		
			const res=await axios.post('/api/posts', formData, {
				headers:{
					Accept:'application/json',
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${token}`
				}
			})
			console.log(res.data.success)
			setMessage('You have successfully created a post')
			setTitle('')
			setDescription('')
			setImageFileSet('')
			setImageFileSetPreview('/images/img_notFound.png')
			setTimeout(()=>{setMessage('')}, 5000)
			clearTimeout()
		}catch(err){
			//console.log(err.response.statusText)	
			console.log(err.response.data.message)	
			setError('Something went wrong. A Post has not been created')
			setTimeout(()=>{setError('')}, 5000)
			clearTimeout()			
		}
	}

	const onFileSelected=e=>{
		if(e.target.name==='imageFileSet'){
			console.log('onfilesele: ', e.target.files[0])
			const reader=new FileReader()
			reader.onload=()=>{
				if(reader.readyState===2){
					setImageFileSetPreview(reader.result)
					setImageFileSet(reader.result)
				}
			}
			reader.readAsDataURL(e.target.files[0])
		}
	}	
	
	return(
		<>
			<Link to='/' className='btn btn-light my-3'>
				Go Back
			</Link>
			{message && (<h4 style={{fontSize:'12px',marginBottom:'30px',color:'green'}}>{message}</h4>)}
			{error && (<h4 style={{fontSize:'12px',marginBottom:'30px',color:'red'}}>{error}</h4>)}
			
			<FormContainer>
				<h1 className='space'>Create Post</h1>

				<Form onSubmit={submitHanlder}
					encType='multipart/form-data' 
					className='mb-3 mt-3'
				>
					<Form.Group controlId='title' className='mb-3 mt-3'>
						<Form.Label>Title</Form.Label>
						<Form.Control
							type='title'
							placeholder='Enter Title'
							value={title}
							onChange={e=>setTitle(e.target.value)}
						></Form.Control>
					</Form.Group>
					
					<Form.Group controlId='description' className='mb-3 mt-3'>
						<Form.Label>Description</Form.Label>
						<Form.Control
							as="textarea" rows={6} 
							placeholder='Enter Description'
							value={description}
							onChange={e=>setDescription(e.target.value)}
						></Form.Control>
					</Form.Group>					
							
					<Form.Group controlId='imageFileSet' className='mb-3 mt-3'>
						<Form.Label className='imgLabel'>
							<AddPhotoAlternateIcon style={{marginTop:'10px', width:'60px', height:'60px'}} />
							Chooase Image
						</Form.Label>
						{imageFileSetPreview && (
						<Form.Control 
							type='file'
							name='imageFileSet'
							accept='.png, .jpeg, .jpg'
							onChange={onFileSelected}
							style={{marginTop:'-30px'}}
						/>)}
					</Form.Group>
						
					{setImageFileSetPreview? (
						<Figure>
							<Figure.Image 
								alt='New Post Preview'
								src={imageFileSetPreview}
								width={200} height={150}
								fluid
							/>
						</Figure>
					) : (
						<div className='formSpace'>No Preview</div>
					)}				
				
					<Row>
						<Button type='submit' variant='primary'>
							New Post
						</Button>
					</Row>
				</Form>
			</FormContainer>
		</>
	)
}
export default PostNew