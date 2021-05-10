import './LoginForm.css'
import React, {useState} from 'react'
const LoginForm = (props) => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")

	const handleClick = (e) => {
		e.preventDefault()
		//console.log(username,password)
		props.login(`username=${username}&password=${password}`)
	}

	const handleUsernameChange = (e) => {
		setUsername(e.target.value)
	}

	const handlePasswordChange = (e) => {
		setPassword(e.target.value)
	}
	return (
		<form className ="loginForm">

		  
		    <label htmlFor="username"><b>Username</b></label>
		    <input type="text" placeholder="Enter Username" name="usename" onChange = {handleUsernameChange}/>

		    <label htmlFor="password"><b>Password</b></label>
		    <input type="password" placeholder="Enter Password" name="password" onChange ={handlePasswordChange} />
		        
		    <button type="submit" onClick = {handleClick}>Login</button>


		</form>
	)
}

export default LoginForm