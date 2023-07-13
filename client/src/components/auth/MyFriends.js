import {Link} from 'react-router-dom'
import {Card} from 'react-bootstrap'


const MyFriends=({friend})=>{

	return(
	<Card className='my-2 p-2 rounded'>
		<Link to={`/users/${friend._id}`}>
			<Card.Img 
				src={friend.avatar? 
					friend.avatar.url : '/images/default_avatar.jpg'} 
					variant='top' width={100} height={50} />
		</Link>
		<Card.Body>
			<Link to={`/users/${friend._id}`}>
				<Card.Title as='div'>
					<strong>{friend.username}</strong>
				</Card.Title>
			</Link>
		</Card.Body>
	</Card>
	)
}
export default MyFriends