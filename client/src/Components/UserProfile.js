import './UserProfile.css'
import React, {useEffect,useState} from 'react'

const UserProfile = (props) => {

	const [user,setUser] = useState(null)

	const {id} = props.match.params

	useEffect(() => {
		fetch(`/api/user/${id}`, {
			 "method":"GET",
			 "headers": {
			              "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
			            }

			        }).then(response => {return response.json()})
					.then(response => {
						console.log(response)
						setUser(response[0])
					})
	}, [])

	if(user === null){
		return(
			<h1> Loading... </h1>
		)
	}

	return(
		<div className="userProfile">
			<h1>{user.username}</h1>
		</div>
	)

}

export default UserProfile