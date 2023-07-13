import React, {useContext, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import axios from 'axios'
import {AuthContext} from '../../contexts/AuthContext'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'


const UserFollowers=({userDetails})=>{
	const [followed, setFollowed]=useState(false)
	const {user:currentUser, dispatch}=useContext(AuthContext)


	useEffect(()=>{
		if(userDetails && userDetails._id){
			setFollowed(currentUser.followings.includes(userDetails._id))
		}		
	},[currentUser, userDetails, userDetails._id])
	
	const clickHandler=async()=>{
		try{	
			if(currentUser._id){
				if(followed){
					await axios.put(`/api/users/${userDetails._id}/unfollow`, {
						userId:currentUser._id
					})
					dispatch({type:'UNFOLLOW', payload:userDetails._id})
				}else{
					await axios.put(`/api/users/${userDetails._id}/follow`, {
						userId:currentUser._id
					})
					dispatch({type:'FOLLOW', payload:userDetails._id})				
				}
			}
		}catch(err){
			console.log(err)
		}
		setFollowed(!followed)
	}
	
	return(
		<>
		{userDetails._id !== currentUser._id && (
			<Button className=''
				onClick={clickHandler}
			>
				{followed? 'Unfollow ' : 'Follow '}
				{followed? 
					<RemoveCircleOutlineIcon /> : 
					<AddCircleOutlineIcon />
				}
			</Button>
		)}
		</>	
	)
}
export default UserFollowers