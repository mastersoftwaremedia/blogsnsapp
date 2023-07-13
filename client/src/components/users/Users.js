import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Row, Col} from 'react-bootstrap'
import axios from 'axios'
import UserCard from './UserCard'
import UserPaginate from '../layout/UserPaginate'


const Users=({match})=>{
	const userKeyword=match.params.userKeyword
	const userPageNumber=match.params.userPageNumber || 1
	const [users, setUsers]=useState([])
	const [userPages, setUserPages]=useState(1)
	const [userPage, setUserPage]=useState(1)

	useEffect(()=>{
		const getUsers=async(userKeyword='', userPageNumber='')=>{
			try{
				const res=await axios.get(`/api/users?userKeyword=${userKeyword}&userPageNumber=${userPageNumber}`)
				setUsers(res.data.users)
				setUserPages(res.data.userPages)
				setUserPage(res.data.userPage)
			}catch(err){
				console.log(err.response.data.message)
			}
		}
		getUsers(userKeyword, userPageNumber)
	}, [userKeyword, userPageNumber])

		
	return(
		<>
			<Link to='/users' className='btn btn-light'>Go Back</Link>
			<h1>All Users</h1>
			{users.length > 0? (
			<>
				<Row>
					{users.map(user=>(
						<Col sm={12} md={6} lg={4} xl={3} key={user._id} className='align-items-stretch d-flex'>
							<UserCard user={user} />
						</Col>
					))}
				</Row>
				<UserPaginate userPages={userPages} userPage={userPage} 
					userKeyword={userKeyword ? userKeyword : ''} />
			</>
			) : (
				<div>No users!</div>
			)}
		</>
	)
}
export default Users