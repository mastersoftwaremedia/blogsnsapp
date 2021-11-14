import React, {useContext, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {Row, Col, Image, ListGroup} from 'react-bootstrap'
import {AuthContext} from '../../contexts/AuthContext'
import UserFollowers from './UserFollowers'
import {format} from 'timeago.js'
import axios from 'axios'
import ApiIcon from '@mui/icons-material/Api'


const UserDetails=({match, history})=>{
	const [userDetails, setUserDetails]=useState({})
	const id=match.params.id
	const {user, token}=useContext(AuthContext)

	useEffect(()=>{
		if(user && user._id === userDetails._id){
			history.push('/myprofile')
		}		
	}, [user, history, userDetails._id])

	useEffect(()=>{
		if(user && token){
			const getUser=async id=>{	
				try{
					const res=await axios.get(`/api/users/${id}`, {	
						headers:{
							Authorization: `Bearer ${token}`
						}
					})
					setUserDetails(res.data)
				}catch(err){
					console.log(err.response.data.message)
				}
			}
			getUser(id)
		}else{
			history.push('/login')
		}
	},[user, token, id, history])

	return(
		<>
			<Link to='/users' className='btn btn-light my-3'>Go Back</Link>
			{userDetails && (
			<div >
				<Row className='bottomSpace'>
					<Col md={6}>
						<Image 
							src={userDetails.avatar?
								userDetails.avatar.url :
								'/images/default_avatar.jpg'
							} 
							alt={userDetails._id} 
							fluid width={400} height={350} />
					</Col>
					<Col md={6}>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h3>{userDetails.username}</h3>
							</ListGroup.Item>
							<ListGroup.Item>
								{userDetails.email}
							</ListGroup.Item>			
							<ListGroup.Item>
								Joined since: {format(userDetails.createdAt)}
							</ListGroup.Item>							

							{userDetails.followings && (
							<ListGroup.Item className="list-group-item d-flex justify-content-space align-items-center">							
								<ApiIcon style={{width:'20px', height:'20px', marginRight:'10px'}} />You are following {userDetails.followings? userDetails.followings.length : '0'}{' '} {userDetails.followings.length===1? 'friend' : 'friends'}
							</ListGroup.Item>									
							)}							

							{userDetails.followers && (
							<ListGroup.Item className="list-group-item d-flex justify-content-space align-items-center">
								<ApiIcon style={{width:'20px', height:'20px', marginRight:'10px'}} />{userDetails.followers? userDetails.followers.length : '0'}{' '}{userDetails.followers.length===1? 'Friend is' : 'Friends are'} following you 
							</ListGroup.Item>	
							)}


							<ListGroup.Item className="list-group-item d-flex justify-content-between align-items-center">
								<UserFollowers key={userDetails._id} userDetails={userDetails} />
							</ListGroup.Item>
																					
						</ListGroup>
					</Col>

				</Row>
			</div>
			)}
		</>
	)
}
export default UserDetails