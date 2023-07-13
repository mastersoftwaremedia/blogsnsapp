import React, {useContext, useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Row, Col} from 'react-bootstrap'
import {AuthContext} from '../../contexts/AuthContext'
import axios from 'axios'
import PostCard from './PostCard'


const MyPosts=()=>{
	const [posts, setPosts]=useState([])
	const {user, token}=useContext(AuthContext)
	const id=user._id
	console.log(id)

	useEffect(()=>{
		const getMyPosts=async(id)=>{
			try{
				const res=await axios.get(`/api/posts/myposts/${id}`, {
					headers:{
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`						
					}					
				})
				setPosts(res.data)
			}catch(err){
				//console.log(err.response.statusText)
				console.log(err.response.data.message)
			}
		}
		getMyPosts(id)
	}, [token, id])

		
	return(
		<>
			<Link to='/' className='btn btn-light'>Go Back</Link>
			<h1>All My Posts</h1>
			{posts.length > 0? (
			<>
				<Row>
					{posts.map(post=>(
						<Col sm={12} md={6} lg={4} xl={3} key={post._id} className='align-items-stretch d-flex'>
							<PostCard post={post} />
						</Col>
					))}
				</Row>
			</>
			) : (
				<div>No posts!</div>
			)}
		</>
	)
}
export default MyPosts