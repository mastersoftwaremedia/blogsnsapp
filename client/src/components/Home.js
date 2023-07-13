import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Row, Col} from 'react-bootstrap'
import axios from 'axios'
import PostCard from './posts/PostCard'
import Paginate from './layout/Paginate'

const Home=({match})=>{
	const keyword=match.params.keyword
	const pageNumber=match.params.pageNumber || 1
	const [posts, setPosts]=useState([])
	const [pages, setPages]=useState(10)
	const [page, setPage]=useState(1)
	
	useEffect(()=>{
		const getPosts=async(keyword='', pageNumber='')=>{
			try{
				const res=await axios.get(`/api/posts?keyword=${keyword}&pageNumber=${pageNumber}`)
				setPosts(res.data.posts)
				setPages(res.data.pages)
				setPage(res.data.page)
			}catch(err){
				console.log(err.response.data.message)
			}
		}
		getPosts(keyword, pageNumber)
	},[keyword, pageNumber])
	
	return(
		<>
			<Link to='/' className='btn btn-light'>Go Back</Link>
			<h1>Latest Posts</h1>
			{posts.length > 0? (
			<>
				<Row>
				{posts.map(post=>(
					<Col sm={12} md={6} lg={4} xl={3} key={post._id} 
					className='align-items-stretch d-flex'>
						<PostCard post={post} />
					</Col>
				))}
				</Row>
				<Paginate pages={pages} page={page} keyword={keyword? keyword:''} />
			</>
			) : (
				<div>
					No posts!
				</div>
			)}
		</>
	)
}
export default Home