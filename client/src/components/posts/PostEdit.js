import React, {useContext, useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Row, Form, Figure, Button} from 'react-bootstrap'
import {AuthContext} from '../../contexts/AuthContext'
import FormContainer from '../layout/FormContainer'
import axios from 'axios'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'


const PostEdit=({match, history})=>{
	const [post, setPost]=useState({})
	const [error, setError]=useState(false)
	const [title, setTitle]=useState('')
	const [description, setDescription]=useState('')
	const [imageFileSet, setImageFileSet]=useState('')
	const [imageFileSetPreview, setImageFileSetPreview]=useState('/images/img_notFound.png')

	const {token}=useContext(AuthContext)
	const id=match.params.id
	
		
	useEffect(()=>{
		if(post && post._id !== id){
			const getPost=async id=>{	
				try{
					const res=await axios.get(`/api/posts/${id}`, {
						headers:{
							Authorization: `Bearer ${token}`
						}
					})
					setPost(res.data)
				}catch(err){
					console.log(err.response.data.message)
				}
			}
			getPost(id)
		}else{
			setTitle(post.title)
			setDescription(post.description)
			setImageFileSetPreview(post.imageFileSet.url)
		}
	},[post, token, id])
	

	const submitHandler=async e=>{
		e.preventDefault()
		try{
			const formData=new FormData()
			formData.set('title', title)
			formData.set('description', description)
			formData.set('imageFileSet', imageFileSet)
			
			const res=await axios.put(`/api/posts/${id}`, formData, {
				headers:{
					Accept:'application/json',
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${token}`
				}
			})
			console.log('success', res.data.success)
			setTitle('')
			setDescription('')
			setImageFileSet('')
			setImageFileSetPreview('/images/img_notFound.png')
			history.push('/')			
		}catch(err){
			console.log(err.response)
			setError('Post has not been updated!')
			setTimeout(()=>{setError('')}, 5000)
			clearTimeout()		
		}			
	}
	
	const onFileSelected=e=>{
		const reader=new FileReader()
		reader.onload=()=>{
			if(reader.readyState===2){
				setImageFileSetPreview(reader.result)
				setImageFileSet(reader.result)
			}
		}
		reader.readAsDataURL(e.target.files[0])
	}		

	return(
		<>
			<Link to='/' className='btn btn-light my-3'>
				Go Back
			</Link>
			{error && (<h4 style={{fontSize:'12px',marginBottom:'30px',color:'red'}}>{error}</h4>)}		
			
			<FormContainer>
				<h1 className='space'>Edit Post</h1>	
				<Form onSubmit={submitHandler}
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
								alt='Edit Post Preview'
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
							Update Post
						</Button>
					</Row>
				</Form>
			</FormContainer>
		</>
	)
}
export default PostEdit