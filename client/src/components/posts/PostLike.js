import React, {useEffect, useState} from 'react'
import axios from 'axios'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'


const PostLike=({post, user, token})=>{
	const [like, setLike]=useState([])
  const [isLiked, setIsLiked]=useState(false)
	console.log('PostLike post: ', post.likes)
	console.log('PostLike user: ', user)

	
	useEffect(()=>{
		if(post.likes && post.likes.length > 0){
			setLike(post.likes.length)
			setIsLiked(post.likes.includes(user._id))
		}
	},[user._id, post.likes])
	
	
	const likeHandler=async()=>{
		try{
			await axios.put(`/api/posts/${post._id}/like`, {userId: user._id}, {
				headers:{
					Authorization: `Bearer ${token}`
				}
			})
		}catch(err){
			//console.log(err.response.statusText)
			console.log(err)
		}
    setLike(isLiked ? like-1 : like+1)
    setIsLiked(!isLiked)
  }	
	
	
	return(
		<div onClick={likeHandler}>
			<FavoriteBorderIcon style={{width:'35px', height:'35px', color:'red'}} /> 
			<span className="">{like===0? '0' : like} people liked it</span>
		</div>		
	)
}
export default PostLike