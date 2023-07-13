export default function AuthReducer(state, action){
	switch(action.type){
		
		case 'LOGIN_SUCCESS':
			return{
				user:action.payload,
				token:action.payload.token
			}
		case 'LOGOUT':
			localStorage.clear()
			document.location.href='/login'
			return{
				user:null,
				token:null
			}

		case 'FORGOT_PASSWORD_SUCCESS':
			return{
				...state,
				success:action.payload.success,
				message:action.payload.message
			}
		case 'NEW_PASSWORD_SUCCESS':
			return {success:action.payload.success}
			
			
		case 'PROFILE_UPDATE_SUCCESS':
			document.location.href='/users'
			return{
				user:action.payload,
				token:action.payload.token
			}
			
		case 'FOLLOW':
			return{
				...state,
				user:{
					...state.user,
					followings:[
						...state.user.followings, action.payload
					]
				}
			}
		case 'UNFOLLOW':
			return{
				...state,
				user:{
					...state.user,
					followings:state.user.followings.filter(
						following=>following !== action.payload
					)
				}
			}
		
		default:
			return state
	}
}