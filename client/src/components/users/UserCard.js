import {Link} from 'react-router-dom'
import {Card} from 'react-bootstrap'
import {format} from 'timeago.js'


const UserCard=({user})=>{
	return(
	<Card className='my-3 p-3 rounded'>
		<Link to={`/users/${user._id}`}>
			<Card.Img src={
				user.avatar? 
					user.avatar.url : '/images/default_avatar.jpg'
				} 
				variant='top' width={175} height={200}  />
		</Link>
		<Card.Body>
			<Link to={`/users/${user._id}`}>
				<Card.Title as='div'>
					<strong>{user.username}</strong>
				</Card.Title>
			</Link>
			<Card.Text as='div' style={{fontSize:'15px'}}>
				<p>Joined since: {format(user.createdAt)}</p>
			</Card.Text>
		</Card.Body>
	</Card>
	)
}
export default UserCard