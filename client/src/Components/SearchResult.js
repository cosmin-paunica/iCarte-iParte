import './SearchResult.css'
import React, {useEffect, useState,useRef} from 'react'
const SearchResult = (props) => {



	console.log(props)

	const [searchString,setSearchString] = useState(props.location.split("/")[2])
	const isInitialMount = useRef(true)
	
	
	console.log(searchString)

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

	
	if(results !== null) {
		return(
			<div className="SearchResult">
				{
					results.map(book => (
						<h1> {book.volumeInfo.title} </h1>
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