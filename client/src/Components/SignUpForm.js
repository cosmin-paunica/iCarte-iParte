import './SignUpForm.css'
import React, {useState} from 'react'
const SignUpForm = () => {
	const [username, setUsername] = useState(null)
	const [email, setEmail] = useState(null)
	const [password, setPassword] = useState(null)
	const [confirmPassword, setConfirmPassword] = useState(null)
	const [error, setError] = useState(null)

	const checkInput = () => {
		let notNullFlag = username && email && password && confirmPassword

		if(!notNullFlag)
			return "Please fill every field of the form"

		let notEmptyStringFlag = username.trim() !== "" && email.trim() !== "" && password.trim() !== "" && confirmPassword.trim() !== ""

		if(!notEmptyStringFlag)
			return "Please fill every field of the form"


		const allowedCharacters = "0123456789abcdefghijklmnopqrstuvwxyz#_@!"

		let usernameFlag = true, emailFlag = true, passwordFlag = true, confirmPasswordFlag = true

		for(let c in username.split(""))
			if(!allowedCharacters.includes(c))
				return `Unallowed character ${c} in username`

		for(let c in email.split(""))
			if(!allowedCharacters.includes(c))
				return `Unallowed character ${c} in email`

		for(let c in password.split(""))
			if(!allowedCharacters.includes(c))
				return `Unallowed character ${c} in password`

		if(password !== confirmPassword)
			return "Passwords do not match"

		return "OK"

	}

	const handleUsernameChange = (e) => {
		setUsername(e.target.value)
	}

	const handleEmailChange = (e) => {
		setEmail(e.target.value)
	}

	const handlePasswordChange = (e) => {
		setPassword(e.target.valie)
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
			<input type="text" placeholder="Enter Password" name="password" onChange = {handlePasswordChange}/>
			<label htmlFor="password_confirm"><b>Confirm your password</b></label>
			<input type="text" placeholder="Enter Password again" name="password_confirm" onChange = {handlePasswordConfirmChange}/>
			<button type="submit" onClick = {handleClick}> Submit </button>
		</form>
	)
}

export default SignUpForm