import {Link} from 'react-router-dom'
import {Card} from 'react-bootstrap'
import FavoriteIcon from '@mui/icons-material/Favorite'


const PostCard=({post})=>{
	
	return(
	<Card className='my-3 p-3 rounded'>
		<Link to={`/posts/${post._id}`}>
			<Card.Img src={post.imageFileSet? post.imageFileSet.url : '/images/img_notFound.png'} variant='top' width={175} height={200} />
		</Link>
		<Card.Body>
			<Link to={`/posts/${post._id}`}>
				<Card.Title as='div'>
					<strong>{post.title}</strong>
				</Card.Title>
			</Link>
			<Card.Text as='div' style={{fontSize:'15px'}}>
				<p>posted by: {post.name}</p>
			</Card.Text>
			<Card.Text as='div' style={{fontSize:'15px'}}>
				<div className="">
					<FavoriteIcon style={{width:'30px', height:'30px', color:'red'}} />
					<span style={{paddingLeft:'5px'}}>
					{post.likes.length===0? '0' : post.likes.length} people liked it
					</span>
				</div>
			</Card.Text>
		</Card.Body>
	</Card>
	)
}
export default PostCard