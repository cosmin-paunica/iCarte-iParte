import './FriendList.css'
import React, {useState, useEffect} from 'react'
import Friend from './Friend.js'
const FriendList = (props) => {
	const [friends, setFriends] = useState([])
	const [people,setPeople] = useState([])
	const [acceptRequests,setAcceptRequests] = useState([])
	
	useEffect(async() => {
		// should do a call to the API, but we will hard-code the values right now
		const API_friends = [
			{
				"username":"gherutz007",
				"profile_pic":"https://imgur.com/9jSkDVi.jpeg"
			},
			{
				"username":"KIoha",
				"profile_pic":"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/President_Trump_Meets_with_the_President_of_Romania_%2848587349852%29_%28cropped%29.jpg/330px-President_Trump_Meets_with_the_President_of_Romania_%2848587349852%29_%28cropped%29.jpg"
			},
			{
				"username":"simo",
				"profile_pic":"https://s.iw.ro/gateway/g/ZmlsZVNvdXJjZT1odHRwJTNBJTJGJTJG/c3RvcmFnZTAxZGlnaXMucmNzLXJkcy5y/byUyRnN0b3JhZ2UlMkYyMDIxJTJGMDQl/MkYzMCUyRjEzMjAyMzlfMTMyMDIzOV9o/YWxlcC0xLnBuZyZ3PTcwMCZoPTQyMCZo/YXNoPTA1MjI4ZGI4MGMzOGRiMzQ3MTJjNmZlNTFkODFkMjM5.thumb.jpg"
			}
		]
		let data = await fetch(`/api/followers`)
		data = await data.json();
		console.log(data);
		data = data.filter(e=>e.pending === false)
		API_friends.push(...data);
		console.log(API_friends);
		
		setFriends(API_friends)

		let newPeople = await fetch(`api/user`)
		newPeople = await newPeople.json()
		newPeople = newPeople.filter(e=> API_friends.filter(f=> f.ID_user == e.ID_user).length ==0); // scot oamenii carora le-am dat follow

		setPeople(newPeople)

		let requests = await fetch(`api/followers`)
		requests = await requests.json()
		console.log(requests);
		setAcceptRequests(requests.filter(e=>e.pending === true))
	}, [])

	const follow = async(id)=>{
		let res = await fetch(`api/follow/${id}`,{method:"POST"})
		res = await res.json()
		console.log(res);
	}
	const acceptFollow = async(id)=>{
		let res = await fetch(`api/accept/${id}`,{method:"POST"})
		res = await res.json()
		console.log(res);
	}

	
	return(
		<div className="friendList">
			<h2>Friends</h2>
			<hr></hr>
			{
				friends.map(friend => <Friend username={friend.username} profile_pic={friend.profile_pic} key ={friend.username}/>)
			}
			<h2>Cereri de follow</h2>
			{
				acceptRequests.map(req => <div key ={req.username}><span>{req.username}</span> <a onClick={()=>acceptFollow(req.ID_user)}>Accept Follow</a> </div>)
			}
			<h2>Recomandari de prieteni</h2>
			<hr></hr>
			{
				people.map(person => <div key ={person.username}><span>{person.username}</span> <a onClick={()=>follow(person.ID_user)}>Follow</a> </div> )
			}
		</div>
	)
}

export default FriendList