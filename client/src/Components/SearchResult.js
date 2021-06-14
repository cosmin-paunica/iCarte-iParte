import './SearchResult.css'
import React, {useEffect, useState,useRef} from 'react'
import {Link} from 'react-router-dom'
const SearchResult = (props) => {


	


	const [searchString,setSearchString] = useState(props.location.split("/")[2])
	const isInitialMount = useRef(true)
	
	


	const [bookResults,setBookResults] = useState(null)
	const [userResults, setUserResults] = useState(null)
	const [groupResults,setGroupResults] = useState(null)


	useEffect(() => {

		fetch(`/api/books/${searchString}`, {
	            "method":"GET",
	            "headers": {
	              "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
	            }

	        }).then(response => {console.log("raspuns",response); return response.json()})
			.then(response => {
				
				response.length > 0 ? setBookResults(response) : setBookResults([])
			})


		fetch(`/api/users/${searchString}`, {
	            "method":"GET",
	            "headers": {
	              "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
	            }

	        }).then(response => { return response.json()})
			.then(response => {
				console.log("raspuns useri",response);
				response.length > 0 ? setUserResults(response) : setUserResults([])
			})

			fetch(`/api/groups/${searchString}`, {
	            "method":"GET",
	            "headers": {
	              "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
	            }

	        }).then(response => { return response.json()})
			.then(response => {
				console.log("raspuns grupuri",response);
				response.length > 0 ? setGroupResults(response) : setGroupResults([])
			})

	},[])

	
	if(bookResults !== null && bookResults !== []) {
		return(
			<div className="searchResult">
				{
					bookResults.map(book => (
							<div className ="bookSearchResult">
								<Link to={`/book/${book.id}`}>
									<h1> {book.volumeInfo.title} </h1>
									<img src = {book.volumeInfo.imageLinks.smallThumbnail} />
								</Link>

							</div>
						)
					)
				}

				{
					userResults.map(user => (
							<div className="userSearchResult">
								<Link to = {`/user/${user.ID_user}`}>
									<h1>{user.username}</h1>
								</Link>
							</div>
					))
				}

				{
					groupResults.map(group => (
							<div className ="groupSearchResult">
								<Link to = {`/group/${group.ID_group}`}>
									<h1>{group.name}</h1>
								</Link>
							</div>
					))
				}
				
			</div>
		)
	}
	return (
		<h1> Loading... </h1>
	)

}

export default SearchResult