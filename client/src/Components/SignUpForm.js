import './SignUpForm.css'
import React, {useState} from 'react'
import {Link} from 'react-router-dom'
const checkSignUpInput = (username, email, password, confirmPassword) => {
    
    let result = {isValid : false, message : "", passwordStrength: ""}

    let notNullFlag = username && email && password && confirmPassword

    if(!notNullFlag){
        result.message = "Please fill every field of the form"
        return result
    }

    let notEmptyStringFlag = username.trim() !== "" && email.trim() !== "" && 
                        password.trim() !== "" && confirmPassword.trim() !== ""

    if(!notEmptyStringFlag){
        result.message = "Please fill every field of the form"
        return result
    }

    if(username.length > 30){
        result.message = "Username length is greater than 30"
        return result
    }

    if(email.length > 50){
        result.message = "Email length is greater than 50"
        return result
    }

    if(password !== confirmPassword){
        result.message = "Passwords do not match"
        return result
    }

    const allowedChars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ*%&#_@!."
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
            allowedCharsFlag = `Unallowed character ${c} in username`
            return false
        }
        return true
    })

    chars = password.split("")
    chars.every(c => {
        if(!allowedCharsSet.has(c)){
            allowedCharsFlag = `Unallowed character ${c} in username`
            return false
        }
        return true
    })

    chars = password.split("")
    chars.every(c => {
        if(!allowedCharsSet.has(c)){
            allowedCharsFlag = `Unallowed character ${c} in username`
            return false
        }
        return true
    })


    if (allowedCharsFlag != "OK"){
        result.message = allowedCharsFlag
        return result
    }
    

    const validEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (!validEmail.test(String(email).toLowerCase())){
        result.message = "Invalid email"
        return result
    }


    const minLength = new RegExp('(?=.{8,})')
    const hasUppercaseLetter = new RegExp('(?=.*[A-Z])')
    const hasLowercaseLetter = new RegExp('(?=.*[a-z])')
    const hasDigit = new RegExp('(?=.*[0-9])')
    const hasSpecialChar = new RegExp('([^A-Za-z0-9])')

    const strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
    const mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')

    if(!minLength.test(String(password))){
        result.message = "The password needs at least 8 characters"
        return result
    }
    if(!hasUppercaseLetter.test(String(password))){
        result.message = "The password needs at least one uppercase letter"
        return result
    }
    if(!hasLowercaseLetter.test(String(password))){
        result.message = "The password needs at least one lowercase letter"
        return result
    }
    if(!hasDigit.test(String(password))){
        result.message = "The password needs at least one digit"
        return result
    }
    if(!hasSpecialChar.test(String(password))){
        result.message = "The password needs at least one special character"
        return result
    }

    result.isValid = true
    
    if(strongPassword.test(String(password))){
        result.passwordStrength = "Strong"
    } else if (mediumPassword.test(String(password))){
        result.passwordStrength = "Medium"
    } else {
        result.passwordStrength = "Weak"
    }
    
    return result

}
const SignUpForm = (props) => {
	const [username, setUsername] = useState(null)
	const [email, setEmail] = useState(null)
	const [password, setPassword] = useState(null)
	const [confirmPassword, setConfirmPassword] = useState(null)
	const [error, setError] = useState(null)

	const checkSignUpInput = (username, email, password, confirmPassword) => {
    
    let result = {isValid : false, message : "", passwordStrength: ""}

    let notNullFlag = username && email && password && confirmPassword

    if(!notNullFlag){
        result.message = "Please fill every field of the form"
        return result
    }

    let notEmptyStringFlag = username.trim() !== "" && email.trim() !== "" && 
                        password.trim() !== "" && confirmPassword.trim() !== ""

    if(!notEmptyStringFlag){
        result.message = "Please fill every field of the form"
        return result
    }

    if(username.length > 30){
        result.message = "Username length is greater than 30"
        return result
    }

    if(email.length > 50){
        result.message = "Email length is greater than 50"
        return result
    }

    if(password !== confirmPassword){
        result.message = "Passwords do not match"
        return result
    }

    const allowedChars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ*%&#_@!."
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
            allowedCharsFlag = `Unallowed character ${c} in username`
            return false
        }
        return true
    })

    chars = password.split("")
    chars.every(c => {
        if(!allowedCharsSet.has(c)){
            allowedCharsFlag = `Unallowed character ${c} in username`
            return false
        }
        return true
    })

    chars = password.split("")
    chars.every(c => {
        if(!allowedCharsSet.has(c)){
            allowedCharsFlag = `Unallowed character ${c} in username`
            return false
        }
        return true
    })


    if (allowedCharsFlag != "OK"){
        result.message = allowedCharsFlag
        return result
    }
    

    const validEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (!validEmail.test(String(email).toLowerCase())){
        result.message = "Invalid email"
        return result
    }


    const minLength = new RegExp('(?=.{8,})')
    const hasUppercaseLetter = new RegExp('(?=.*[A-Z])')
    const hasLowercaseLetter = new RegExp('(?=.*[a-z])')
    const hasDigit = new RegExp('(?=.*[0-9])')
    const hasSpecialChar = new RegExp('([^A-Za-z0-9])')

    const strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
    const mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')

    if(!minLength.test(String(password))){
        result.message = "The password needs at least 8 characters"
        return result
    }
    if(!hasUppercaseLetter.test(String(password))){
        result.message = "The password needs at least one uppercase letter"
        return result
    }
    if(!hasLowercaseLetter.test(String(password))){
        result.message = "The password needs at least one lowercase letter"
        return result
    }
    if(!hasDigit.test(String(password))){
        result.message = "The password needs at least one digit"
        return result
    }
    if(!hasSpecialChar.test(String(password))){
        result.message = "The password needs at least one special character"
        return result
    }

    result.isValid = true
    
    if(strongPassword.test(String(password))){
        result.passwordStrength = "Strong"
    } else if (mediumPassword.test(String(password))){
        result.passwordStrength = "Medium"
    } else {
        result.passwordStrength = "Weak"
    }
    
    return result

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
		const flag = checkSignUpInput(username,email,password,confirmPassword)
		if(flag.isValid !== true){
			setError(flag.message)
		}else {
			// make an api call to register the user

			fetch('/api/user', {
	            "method":"POST",
	            "headers": {
	              "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
	            },
	            "body":`username=${username}&email=${email}&password=${password}&confirmPassword=${confirmPassword}`

	        }).then(response => {return response.json()})
			.then(response => {
				response.message === "User added in DB" ? props.login(username) : setError(response.message)

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