import './Group.css'
import React, {useEffect,useState} from 'react'

const Group = (props) => {

	const [group,setGroup] = useState(null)
	const [posts,setPosts] = useState(null)
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


		fetch(`/api/group_posts/${id}`, {
			 "method":"GET",
			 "headers": {
			              "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
			            }

			        }).then(response => {return response.json()})
					.then(response => {
						console.log(`AICI ESTE RASPUNSUL ${response}`)
						setPosts(response)
					})
		
	},[])

	if(group === null || posts === null) {
		return(
			<h1> Loading... </h1>
		)
	}

	return (
		<div className ="groupProfile">
			<h1> {group.name} </h1>
			<p> {group.description} </p>
			{
				posts.map(p => (
					<div className = "post">
						<h2> {p.ID_user} </h2>
						<p> {p.post_timestamp} </p>
						<p> {p.post_text} </p>
					</div>
				))
			}
		</div>
	)

}

export default Group