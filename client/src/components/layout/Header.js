import React, {useContext} from 'react'
import {Route} from 'react-router-dom'
import {LinkContainer} from 'react-router-bootstrap'
import {Image, Navbar, Nav, Container, NavDropdown} from 'react-bootstrap'
import SearchBox from './SearchBox'
import {AuthContext} from '../../contexts/AuthContext'

const Header=({history})=>{
	const {logout, user, token}=useContext(AuthContext)
	const logoutHandler=()=>{
		logout()
	}
	
	return(
		<header>
			<Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
				<Container>
				
					<LinkContainer to='/'>
						<Navbar.Brand>My Posts</Navbar.Brand>
					</LinkContainer>
					
					<Navbar.Toggle aria-controls='responsive-navbar-nav' />
					
					<Navbar.Collapse id='responsive-navbar-nav'>
						<Route render={({history})=><SearchBox history={history} />} />
						
						<Nav className='ml-auto'>
							<LinkContainer to='/'>
								<Nav.Link className='ml-4'>Home</Nav.Link>
							</LinkContainer>
							<LinkContainer to='/users'>
								<Nav.Link className='ml-4'>All Users</Nav.Link>
							</LinkContainer>
							
							{token? (
							<>
								<LinkContainer to='/posts/new'>
									<Nav.Link className='ml-4'>Create Post</Nav.Link>
								</LinkContainer>
								
								<div className='d-flex ml-4'>
									<Image 
										alt={user && user.username}
										src={user.avatar? user.avatar.url : '/images/default_avatar.jpg'}
										width={25} height={25}
										className='mt-2'
										roundedCircle
									/>
									<NavDropdown title={user.username} id='username' className='ml-1' style={{marginLeft:'3px'}}>
										<LinkContainer to='/myprofile'>
											<NavDropdown.Item>My Profile</NavDropdown.Item>
										</LinkContainer>
										<LinkContainer to={`/myposts/${user._id}`}>
											<NavDropdown.Item>My Posts</NavDropdown.Item>
										</LinkContainer>
										<NavDropdown.Item onClick={logoutHandler}>
											Logout
										</NavDropdown.Item>
									</NavDropdown>
								</div>
							</>
							):(
							<>
								<LinkContainer to='/register'>
									<Nav.Link className='ml-4'>Register</Nav.Link>
								</LinkContainer>
								
								<LinkContainer to='/login'>
									<Nav.Link className='ml-4 mr-4'>Login</Nav.Link>
								</LinkContainer>
							</>
							)}
						</Nav>
					</Navbar.Collapse>
				
				</Container>
			</Navbar>
		</header>
	)
}
export default Header