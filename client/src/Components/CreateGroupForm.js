import './CreateGroupForm.css'
import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
const CreateGroupForm = (props) => {


	const history = useHistory()
	const [name,setName] = useState(null)
	const [descr, setDescr] = useState(null)

	const handleClick = (e) => {
		fetch(`/api/groups`,{
			method:"POST",
			headers: {
				"Content-Type":"application/json"
			},
			body:JSON.stringify({
				
				name:name,
				description: descr
			})

		}).then(res=>{
			
			history.push('/')
				
		})
	}

	const handleChange1 = (e) => {
		console.log("HANDLECHANGE1")
		console.log(e)
		setName(e.target.value)
	}

	const handleChange2 = (e) => {
		setDescr(e.target.value)
	}

	return(
		<div className = "createGroupForm">
			<input type="text" placeholder ="Name of the group" onChange = {handleChange1}/>
			<input type = "text" placeholder = "Group description" onChange = {handleChange2} />
			<button onClick = {handleClick}> Create group </button>
		</div>
	)

}


export default CreateGroupForm