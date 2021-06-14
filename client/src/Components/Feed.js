import { useState,useEffect } from 'react'
import './Feed.css'

const Feed = (props) => {
	const [posts,setPosts] = useState([])
	const [friends,setFriends]= useState([])

	useEffect(async() => {
		console.log("posts")
		let friends_data = await fetch(`/api/followers`)
		friends_data = await friends_data.json()
		console.log(friends_data)

	
		let reviews = []
		for(let i=0;i<friends_data.length;i++){
			let review = await fetch(`/api/reviews/user/${friends_data[i].ID_user}`)
			review = await review.json()

			reviews.push(...review)
		}
		console.log("Reviews from friends")
		console.log(reviews)
		setPosts([...reviews].reverse())

	}, [])

	return(
		<div className = "feed">
			User feed from {props.user}
			{
				posts.map(post =>{
					return<div className="feedPost">
						<h3>{post.username}</h3>
						<h4>Cartea: <a href={`/book/${post.ID_carte}`}>{post.ID_carte}</a></h4>
						<p>{post.comment}</p>
						</div>
				})
			}

		</div>
	)

}

export default Feed