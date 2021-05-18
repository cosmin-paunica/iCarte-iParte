import './Book.css'
import React, {useEffect,useState} from 'react'
const Book = (props) => {

	const [book, setBook] = useState(null)

	const {id} = props.match.params

	useEffect(()=>{
		// will make call to API but we will hardcode this for now
		fetch(`/api/book/${id}`, {
			 "method":"GET",
			 "headers": {
			              "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
			            }

			        }).then(response => {return response.json()})
					.then(response => {
						
						setBook(response)
					})
		
	},[])

	if(book) {
		console.log(book)
		return(

			<div className = "book searchResult">
				<h1> {book.data.volumeInfo.title} </h1>
				{book.data.volumeInfo.authors.map(x => (<h2>{x}</h2>))}
				<img src = {book.data.volumeInfo.imageLinks.smallThumbnail} className = "bookImg"/>
				<p>{book.data.volumeInfo.publishedDate} </p>
			</div>
		)
	}

	return (
		<div className = "book">
			<h1> Loading...</h1>
		</div>
	)
	

}

export default Book