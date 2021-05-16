import './SignUpForm.css'
import React, {useState} from 'react'
import {Link} from 'react-router-dom'
const SignUpForm = (props) => {
	const [username, setUsername] = useState(null)
	const [email, setEmail] = useState(null)
	const [password, setPassword] = useState(null)
	const [confirmPassword, setConfirmPassword] = useState(null)
	const [error, setError] = useState(null)

	const checkInput = () => {
		let notNullFlag = username && email && password && confirmPassword

		if(!notNullFlag){
			return "Please fill every field of the form"
		}

		let notEmptyStringFlag = username.trim() !== "" && email.trim() !== "" && password.trim() !== "" && confirmPassword.trim() !== ""

		if(!notEmptyStringFlag){
			return "Please fill every field of the form"
		}

		if(username.length > 30)
			return "Username length is greater than 30"
		if(email.length > 30)
			return "Email length is greater than 30"
		if(password.length > 30)
			return "Password length is greater than 30"


		if(password !== confirmPassword)
			return "Passwords do not match"

		const allowedChars = "0123456789abcdefghijklmnopqrstuvwxyz#_@!"
		const allowedCharsSet = new Set(allowedChars.split(""))

		let allowedCharsFlag = "OK"


		let chars = username.split("")
		chars.every(c => {
			if(!allowedCharsSet.has(c)){
				allowedCharsFlag = `Unallowed character ${c} in username`
				return false
			}
			return true
		})


		chars = email.split("")
		chars.every(c => {
			if(!allowedCharsSet.has(c)){
				allowedCharsFlag = `Unallowed character ${c} in email`
				return false
			}
			return true
		})
		
		chars = password.split("")
		chars.every(c => {
			if(!allowedCharsSet.has(c)) {
				allowedCharsFlag = `Unallowed character ${c} in password`
				return false
			}
			return true
		})

		return allowedCharsFlag
		

	}

	const handleUsernameChange = (e) => {
		setUsername(e.target.value)
	}

	const handleEmailChange = (e) => {
		setEmail(e.target.value)
	}

	const handlePasswordChange = (e) => {
		setPassword(e.target.value)
	}

	const handlePasswordConfirmChange = (e) => {
		setConfirmPassword(e.target.value)
	}

	const handleClick = (e) => {
		e.preventDefault()
		const flag = checkInput()
		if(flag !== "OK"){
			setError(flag)
		}else {
			// make an api call to register the user
			fetch('/api/signup', {
	            "method":"POST",
	            "headers": {
	              "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
	            },
	            "body":`username=${username}&email=${email}&password=${password}&confirmPassword=${confirmPassword}`

	        }).then(response => response.json())
			.then(response => {
				response.response === "OK" ? props.login(username) : setError(response.response)
			})
		}

	}

	return(
		<form className="signUpForm">
			<h2 style={{color:"red"}}> {error} </h2>
			<label htmlFor="username"><b>Username</b></label>
			<input type="text" placeholder="Enter Username" name="usename" onChange = {handleUsernameChange}/>
			<label htmlFor="email"><b>E-mail</b></label>
			<input type="text" placeholder="Enter E-mail" name="email" onChange = {handleEmailChange}/>
			<label htmlFor="password"><b>Password</b></label>
			<input type="password" placeholder="Enter Password" name="password" onChange = {handlePasswordChange}/>
			<label htmlFor="password_confirm"><b>Confirm your password</b></label>
			<input type="password" placeholder="Enter Password again" name="password_confirm" onChange = {handlePasswordConfirmChange}/>
			<input type="submit" value="Submit" id="submit" onClick = {handleClick} />
			<br/>
			<Link to='/'>
				<a href="#" class="button"> Login </a>
			</Link>
		</form>
	)
}

export default SignUpForm