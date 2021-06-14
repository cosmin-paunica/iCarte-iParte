import './Group.css'
import React, {useEffect,useState} from 'react'

const Group = (props) => {

	const [group,setGroup] = useState(null)
  const [members,setMembers] = useState([])


	const [posts,setPosts] = useState(null)
	const [newPost, setNewPost] = useState(null)

	const {id} = props.match.params

	const handlePostChange = (e) => {
		setNewPost(e.target.value)
	}

	const sendPost = (e) => {
		fetch(`/api/group_posts`,{
			method:"POST",
			headers: {
				"Content-Type":"application/json"
			},
			body:JSON.stringify({
				
				ID_group:id,
				post_text: newPost
			})

		}).then(res=>{
			
			console.log(res.json())
				
		})
	}


	useEffect(async ()=>{
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
		let usersData = await fetch(`/api/group/${id}/users`)
		usersData = await usersData.json()
		setMembers(usersData)
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


			<h2> Complete the form below to post something here ! </h2>
			<input type="text" placeholder = "Write something nice !" onChange ={handlePostChange}/>
			<button onClick = {sendPost}> Post ! </button>
			

			<h3>Membrii</h3>
			<div className="members-list">
				<ul>
				{
					members.map(member => <li>{member.username}</li>)
				}
				</ul>
			</div>
			{
				posts.map(p => (
					<div className = "post">
						<h2> {p.username} </h2>
						<p> {p.post_timestamp} </p>
						<p> {p.post_text} </p>
						<hr></hr>
					</div>
				))
			}

		</div>
	)

}

export default Group