import './LoginForm.css'
import React, {useState} from 'react'
import {Link} from 'react-router-dom'
const LoginForm = (props) => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState(null)
  	
  	const loginUser = (user) => {



	    if(password && username && password.trim() !== "" && username.trim() !== "") {
	        fetch('/api/login', {
	            "method":"POST",
	            "headers": {
	              "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
	            },
	            "body":user

	        }).then(response => response.json())
	          .then(response => {
	            if(response.response === "OK") {
	              props.login(username)
	              
	            }else {
	              setError("Invalid credentials")
	            }
	          })      
	      }else {
	        setError("Please fill the fields")
	      }
	}

	const handleClick = (e) => {
		e.preventDefault()
		//console.log(username,password)
		loginUser(`username=${username}&password=${password}`)
	}

	const handleUsernameChange = (e) => {
		setUsername(e.target.value)
	}

	const handlePasswordChange = (e) => {
		setPassword(e.target.value)
	}
	return (
		<form className ="loginForm">
			<h2 style={{color:"red"}}> {error} </h2>
		  
		    <label htmlFor="username"><b>Username</b></label>
		    <input type="text" placeholder="Enter Username" name="usename" onChange = {handleUsernameChange}/>

		    <label htmlFor="password"><b>Password</b></label>
		    <input type="password" placeholder="Enter Password" name="password" onChange ={handlePasswordChange} />
		        
		    <input type="submit" value="Submit" id="submit" onClick = {handleClick}/>
		    <br/>
		    <Link to ='/signup'><a href ="#" class="button"> Register </a></Link>

		</form>
	)
}

export default LoginForm