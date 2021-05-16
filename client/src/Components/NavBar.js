import './NavBar.css'
import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
const NavBar = (props) => {

	let myTimeout = null
	const history = useHistory()
	const handleChange = (e) => {
		const searchString = e.target.value
		clearTimeout(myTimeout)
		console.log(e.target.value)
		console.log(e.key === 'Enter')
		if(e.which === 13) {
			history.push(`/search/${searchString}`)
		}
	}		

	return(
		<ul className="navbar" id ="navbar">
			<li> iCarte-iParte </li>
			<li id ="myprofile"> {props.user} </li>
			<input type="text" placeholder="Search.." onKeyPress = {handleChange}/>
		</ul>
	)
}

export default NavBar