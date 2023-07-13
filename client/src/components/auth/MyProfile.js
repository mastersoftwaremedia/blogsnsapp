import React, {useContext, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {Row, Col, Image, ListGroup} from 'react-bootstrap'
import {AuthContext} from '../../contexts/AuthContext'
import {format} from 'timeago.js'
import axios from 'axios'
import EditIcon from '@mui/icons-material/Edit'
import MyFriends from './MyFriends'
import ApiIcon from '@mui/icons-material/Api'



const MyProfile=({history})=>{
	const [currentUser, setCurrentUser]=useState({})
	const [friends, setFriends]=useState([])

	const {user, token}=useContext(AuthContext)
	const id=user._id

	useEffect(()=>{
		const getUserDetails=async id=>{
			if(user && token){	
				try{
					const res=await axios.get(`/api/auth/${id}`, {
						headers:{
							Authorization: `Bearer ${token}`						
						}
					})
					setCurrentUser(res.data)
				}catch(err){
					console.log(err.response.data.message)
				}
			}else{
				history.push('/login')
			}
		}
		getUserDetails('profile')
	},[id, user, token, history])

	console.log('myProfile currentUser: ', currentUser.followers)
	
	useEffect(()=>{
		const getFriends=async()=>{
			try{
				if(user._id){
					const res=await axios.get(`/api/users/friends/${user._id}`)
					setFriends(res.data)
				}
			}catch(err){
				console.log(err.response.data.message)
			}
		}
		getFriends()
	},[user._id])

	
	useEffect(()=>{
		if(friends && friends.length > 0){
			setFriends(friends)
		}		
	},[friends, friends.length])

	return(
		<>
			<Link to='/users' className='btn btn-light my-3'>Go Back</Link>
			{currentUser && (
			<div >
				<Row className='bottomSpace'>
					<Col md={6}>
						<Image src={currentUser.avatar?
							currentUser.avatar.url :
							'/images/default_avatar.jpg'
							} 
							alt={currentUser._id} 
							fluid width={400} height={350} />
					</Col>
					<Col md={6}>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h3>{currentUser.username}</h3>
							</ListGroup.Item>
							<ListGroup.Item>
								{currentUser.email}
							</ListGroup.Item>
							<ListGroup.Item>
								Joined since: {format(currentUser.createdAt)}
							</ListGroup.Item>			

							<ListGroup.Item className="list-group-item d-flex justify-content-space align-items-center">
								<ApiIcon style={{width:'20px', height:'20px', marginRight:'10px'}} />You are following {user.followings? user.followings.length : '0'}{' '} {user.followings.length===1? 'friend' : 'friends'}
							</ListGroup.Item>	
						
							<ListGroup.Item className="list-group-item d-flex justify-content-space align-items-center">
								<ApiIcon style={{width:'20px', height:'20px', marginRight:'10px'}} />{user.followers? user.followers.length : '0'}{' '}{user.followers.length===1? 'Friend is' : 'Friends are'} following you 
							</ListGroup.Item>				

							{user && user._id === currentUser._id? ( 
							<ListGroup.Item className="list-group-item d-flex justify-content-center align-items-center">
								<Link to={`/myprofile/edit`}
								style={{textDecoration:'none'}}
								>
									<EditIcon style={{width:'35px', height:'35px'}} />{' '} My Profile
								</Link>
							</ListGroup.Item>
							) : ('')}
	
							<ListGroup.Item>
							{friends.length > 0? (
							<>
								<Row>
								{friends.map(friend=>(
									<Col sm={12} md={6} lg={4} xl={3}
										key={friend._id}
										className='align-items-stretch d-flex'>
										<MyFriends friend={friend} /> 
									</Col>
								))}
								</Row>
							</>
							) : ('')}
							</ListGroup.Item>
							
						</ListGroup>
					</Col>

				</Row>
			</div>
			)}
		</>
	)
}
export default MyProfile