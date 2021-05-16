import './Book.css'
import React, {useEffect,useState} from 'react'
const Book = (props) => {

	const [book, setBook] = useState(null)

	const {id} = props.match.params

	useEffect(()=>{
		// will make call to API but we will hardcode this for now
		fetch(`/api/books/${id}`, {
			 "method":"GET",
			 "headers": {
			              "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
			            }

			        }).then(response => {return response.json()})
					.then(response => {
						
						setBook(response[0])
					})
		
	},[])

	if(book) {
		console.log(book)
		return(

			<div className = "book">
				<h1> {book.volumeInfo.title} </h1>
				{book.volumeInfo.authors.map(x => (<h2>{x}</h2>))}
				<img src = {book.volumeInfo.imageLinks.smallThumbnail} className = "bookImg"/>
				<p>{book.volumeInfo.publishedDate} </p>
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