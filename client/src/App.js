import React, {useContext} from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import {AuthContext} from './contexts/AuthContext'
import {Container} from 'react-bootstrap'
import Header from './components/layout/Header'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import MyProfile from './components/auth/MyProfile'
import MyProfileEdit from './components/auth/MyProfileEdit'
import Home from './components/Home'
import Users from './components/users/Users'
import UserDetails from './components/users/UserDetails'
import MyPosts from './components/posts/MyPosts'
import PostDetails from './components/posts/PostDetails'
import PostNew from './components/posts/PostNew'
import PostEdit from './components/posts/PostEdit'


const PrivateRoute=({component:Component, ...rest})=>{
	const {token}=useContext(AuthContext)
	return(
		<Route render={props=>
			token? 
				<Component {...props} /> : 
				<Redirect to='/login' />
		} {...rest} />
	)
}

function App() {
	const {token}=useContext(AuthContext)
	
  return (
    <Router>
			<Header />
			<main className='py-3'>
				<Container>
					<Switch>
					
						<Route path='/login'>
						{token? <Redirect to='/' /> : <Login />}
						</Route>
						<Route path='/register'>
						{token? <Redirect to='/' /> : <Register />}
						</Route>
						
						<Route path='/password/forgot' component={ForgotPassword} />
						<Route path='/password/reset/:token' component={ResetPassword} exact />
						
						
						<PrivateRoute exact path='/myprofile/edit' component={MyProfileEdit} />						
						<PrivateRoute exact path='/myprofile' component={MyProfile} />
						<PrivateRoute exact path='/myposts/:id' component={MyPosts} />
						
						<PrivateRoute exact path='/posts/new' component={PostNew} />
						<PrivateRoute exact path='/posts/:id/edit' component={PostEdit} />
						<PrivateRoute exact path='/posts/:id' component={PostDetails} />
						
						<Route exact path='/search/:keyword' component={Home} />
						<Route exact path='/page/:pageNumber' component={Home} />
						<Route exact path='/search/:keyword/page/:pageNumber' component={Home} />
						<Route exact path='/' component={Home} />
					
						<Route path='/userPage/:userPageNumber' exact component={Users} />
						<Route path='/users' exact component={Users} />
						<PrivateRoute path='/users/:id' exact component={UserDetails} />
					
					</Switch>
				</Container>
			</main>
    </Router>
  )
}
export default App