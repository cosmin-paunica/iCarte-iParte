import './SearchResult.css'
import React, {useEffect, useState,useRef} from 'react'
import {Link} from 'react-router-dom'
const SearchResult = (props) => {



	

	const [searchString,setSearchString] = useState(props.location.split("/")[2])
	const isInitialMount = useRef(true)
	
	


	const [results,setResults] = useState(null)

	useEffect(() => {

		fetch(`/api/books/${searchString}`, {
	            "method":"GET",
	            "headers": {
	              "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
	            }

	        }).then(response => {console.log("raspuns",response); return response.json()})
			.then(response => {
				
				response.length > 0 ? setResults(response) : setResults([])
			})
	},[])

	
	if(results !== null && results !== []) {
		return(
			<div className="SearchResult">
				{
					results.map(book => (
							<Link to={`/book/${book.id}`}>
							<div className ="bookSearchResult">
								<img src = {book.volumeInfo.imageLinks.smallThumbnail} />
								<h1> {book.volumeInfo.title} </h1>
								

							</div>
							</Link>
						)
					)
				}
			</div>
		)
	}
	return (
		<h1> Loading... </h1>
	)

}

export default SearchResult