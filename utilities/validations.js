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

module.exports.checkSignUpInput = checkSignUpInput