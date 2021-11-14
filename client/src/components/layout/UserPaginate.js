import {Pagination} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

const UserPaginate=({userPages, userPage, userKeyword=''})=>{
	return userPages > 1 && (
		<Pagination>
		{[...Array(userPages).keys()].map(x=>(
			<LinkContainer 
				key={x+1} 
				to={`/userPage/${x+1}`}
			>
				<Pagination.Item active={x+1 === userPage}>
					{x+1}
				</Pagination.Item>
			</LinkContainer>
		))}
		</Pagination>
	)
}
export default UserPaginate