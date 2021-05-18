import './FriendList.css'
import React, {useState, useEffect} from 'react'
import Friend from './Friend.js'
const FriendList = (props) => {
	const [friends, setFriends] = useState([])
	
	useEffect(() => {
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
		
		setFriends(API_friends)

	}, [])

	
	return(
		<div className="friendList">
			<h2>Friends</h2>
			<hr></hr>
			{
				friends.map(friend => <Friend username={friend.username} profile_pic={friend.profile_pic} key ={friend.username}/>)
			}
		</div>
	)
}

export default FriendList