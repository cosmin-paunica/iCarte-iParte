import './Group.css'
import React, {useEffect,useState} from 'react'

const Group = (props) => {

	const [group,setGroup] = useState(null)
	const {id} = props.match.params

	useEffect(()=>{
		// will make call to API but we will hardcode this for now
		fetch(`/api/group/${id}`, {
			 "method":"GET",
			 "headers": {
			              "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
			            }

			        }).then(response => {return response.json()})
					.then(response => {
						
						setGroup(response)
					})
		
	},[])

	if(group === null) {
		return(
			<h1> Loading... </h1>
		)
	}

	return (
		<div className ="groupProfile">
			<h1> {group.name} </h1>
			<p> {group.description} </p>
		</div>
	)

}

export default Group