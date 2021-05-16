import './Book.css'
import React, {useEffect,useState} from 'react'
const Book = (props) => {

	const [book, setBook] = useState(null)

	const {id} = props.match.params

	useEffect(()=>{
		// will make call to API but we will hardcode this for now
		const bookObj = {
			"imgUrl":"https://i.pinimg.com/originals/0d/2c/09/0d2c0915b3c86c8ac0680f3f6c88731d.jpg",
			"title":"1984",
			"authors":["George Orwell"]
		}

		setBook(bookObj)
	},[])

	if(book) {
		return(

			<div className = "book">
				<h1> {book.title} </h1>
				{book.authors.map(x => (<h2>{x}</h2>))}
				<img src = {book.imgUrl} className = "bookImg"/>

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