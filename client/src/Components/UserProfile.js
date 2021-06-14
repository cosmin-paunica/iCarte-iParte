import './UserProfile.css'
import React, {useEffect,useState} from 'react'

const UserProfile = (props) => {

	const [user,setUser] = useState(null)
	const [books,setBooks] = useState([])

	const {id} = props.match.params

	useEffect(async () => {
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
			let data = await fetch(`/api/getReadingList/${id}`)
			data = await data.json()
			setBooks(data)
	}, [])

	if(user === null){
		return(
			<h1> Loading... </h1>
		)
	}

	return(
		<div className="userProfile">
			<h1>{user.username}</h1>
			<h3>Carti citite</h3>
			<div className="booksList">
				{
					books.map( book =><div><a href={`/book/${book.ID_book}`}><img src={book.thumbnail}/><p>{book.title}</p></a></div>)
				}
			</div>
		</div>
	)

}

export default UserProfile