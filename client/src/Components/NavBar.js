import './NavBar.css'
import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
const NavBar = (props) => {

	const history = useHistory()

	const handleChange = (e) => {
		const searchString = e.target.value
		if(e.key === 'Enter'){
			if(searchString && searchString.trim() !== ""){
				history.push(`/search/${searchString}`)
			}
		}

	}		

	const handleClick = () => {
		history.push('/createGroup')
	}

	return(
		<ul className="navbar" id ="navbar">
			<li> iCarte-iParte </li>
			<li id = "createGroup" onClick = {handleClick}> Create a group </li>
			<li id ="myprofile"> {props.user} </li>
			<input type="text" placeholder="Search.." onKeyPress = {handleChange}/>
		</ul>
	)
}

export default NavBar