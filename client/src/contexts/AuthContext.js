import React, {createContext, useReducer, useEffect} from 'react'
import AuthReducer from './AuthReducer'

const initialState={
	user:JSON.parse(localStorage.getItem('user')) || null,
	token:JSON.parse(localStorage.getItem('token')) || null,
	message:null,
	success:false
}

export const AuthContext=createContext(initialState)

export const AuthContextProvider=({children})=>{
	const [state, dispatch]=useReducer(AuthReducer, initialState)
	
	useEffect(()=>{
		localStorage.setItem('user', JSON.stringify(state.user))
		localStorage.setItem('token', JSON.stringify(state.token))
	}, [state.user, state.token])
	
	const logout=()=>{
		dispatch({type:'LOGOUT'})
		document.location.href='/login'
	}
	
	return(
		<AuthContext.Provider value={{
			user:state.user,
			token:state.token,
			message:state.message,
			success:state.success,
			dispatch,
			logout
		}}>
			{children}
		</AuthContext.Provider>
	)
}