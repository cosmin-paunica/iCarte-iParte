import './NavBar.css'
import React, {useState} from 'react'
const NavBar = (props) => {

	let myTimeout = null

	const handleChange = (e) => {
		const searchString = e.target.value
		clearTimeout(myTimeout)
		if(searchString && searchString.trim() !== ""){
			myTimeout = setTimeout(()=>{
				console.log(searchString)
				// here i must fetch with a call to the api to search for me
			},1000)
		}	
	}		

	return(
		<ul className="navbar" id ="navbar">
			<li> iCarte-iParte </li>
			<li id ="myprofile"> {props.user} </li>
			<input type="text" placeholder="Search.." onChange = {handleChange}/>
		</ul>
	)
}

export default NavBar