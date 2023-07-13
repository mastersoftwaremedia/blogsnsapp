import React, {useContext, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {Row, Col, Image, ListGroup} from 'react-bootstrap'
import {AuthContext} from '../../contexts/AuthContext'
import PostLike from './PostLike'
import {format} from 'timeago.js'
import axios from 'axios'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'


const PostDetails=({match, history})=>{
	const id=match.params.id
	const [post, setPost]=useState({})
	const [message, setMessage]=useState(null)
	const [success, setSuccess]=useState(false)
	const {user, token}=useContext(AuthContext)
	

	useEffect(()=>{
		if(user && token){
			const getPost=async id=>{
				try{
					const res=await axios.get(`/api/posts/${id}`, {
						headers:{
							Authorization: `Bearer ${token}`
						}
					})
					setPost(res.data)
				}catch(err){
					//console.log(err.response.statusText)
					console.log(err.response.data.message)
				}
			}
			getPost(id)
		}else{
			history.push('/login')
		}
	},[history, token, user, id])

	
	const deleteHandler=async id=>{
		if(user && token){
			try{
				await axios.delete(`/api/posts/${id}`, {
					headers:{
						Authorization: `Bearer ${token}`
					}
				})
				setSuccess(true)
				setMessage('Success! Post has been deleted')
				history.push('/')
			}catch(err){
				//console.log(err.response.statusText)
				console.log(err.response.data.message)
				setSuccess(false)
				setMessage('Post has not been deleted!')
			}
		}else{
			history.push('/login')
		}
	}

	return(
		<>
			<Link to='/' className='btn btn-light my-3'>Go Back</Link>
			{success ? (<h2 style={{color:'green'}}>{message}</h2>) : (
				<h2 style={{color:'red'}}>{message}</h2>
			)}
			{post && (
			<div >
				<Row className='bottomSpace'>
					<Col md={6}>
						<Image 
							src={post.imageFileSet? 
								post.imageFileSet.url : 
								'/images/img_notFound.png'
							} 
							alt={post._id} 
							fluid 
							width={400} height={350} 
						/> 
					</Col>
					<Col md={6}>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h3>{post.title}</h3>
							</ListGroup.Item>
							<ListGroup.Item>
								{post.description}
							</ListGroup.Item>
							<ListGroup.Item>
								posted by: {post.name}
							</ListGroup.Item>				
							<ListGroup.Item>
								posted since: {format(post.publishedAt)}
							</ListGroup.Item>								

							<ListGroup.Item>
								<PostLike key={post._id} 
									post={post} user={user} token={token}
								/>
							</ListGroup.Item>
			
							{user && post.postedBy === user._id? ( 
							<ListGroup.Item className="list-group-item d-flex justify-content-between align-items-center">
								<Link to={`/posts/${post._id}/edit`}>
									<EditIcon style={{width:'35px', height:'35px'}} />
								</Link>
								<div onClick={()=>deleteHandler(post._id)}>
									<DeleteForeverIcon 
									style={{width:'35px', height:'35px'}}
									/>
								</div>
							</ListGroup.Item>
							) : ('')}
							
						</ListGroup>
					</Col>

				</Row>
			</div>
			)}
		</>
	)
}
export default PostDetails