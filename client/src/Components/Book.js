import './Book.css'
import React, {useEffect,useState} from 'react'
const Book = (props) => {

	const [book, setBook] = useState(null)
	const [rating,setRating] = useState(5)
	const [review,setReview] = useState("")
	const [reviews,setReviews] = useState([])

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
					});
			fetch(`/api/reviews/book/${id}`,{method:"GET",headers:{"Content-Type":"application/json"}})
				.then(res => res.json())
				.then(res => {
				setReviews(res)
			})
		
	},[])

	const addToList = ()=>{
		fetch(`/api/reading/${id}`,{method:"POST"}).then(
			console.log("Adaugat la lista")
		).catch(e=>{
			console.log(e)
		})
	}

	const submitReview = (evt) => {
		evt.preventDefault();
		fetch(`/api/reviews`,{
			method:"POST",
			headers: {
				"Content-Type":"application/json"
			},
			body:JSON.stringify({
				ID_carte:id, 
				rating: rating,
				comment: review
			})

		}).then(res=>{
			setReviews(reviews => [...reviews,{ID_carte:id, 
				rating: rating,
				comment: review}])
				
		})

	}	
	if(book) {
		console.log(book)
		return(

			<div className = "book searchResult">
				<h1> {book.data.volumeInfo.title} </h1>
				{book.data.volumeInfo.authors.map(x => (<h2>{x}</h2>))}
				<img src = {book.data.volumeInfo.imageLinks.smallThumbnail} className = "bookImg"/>
				<p>{book.data.volumeInfo.publishedDate} </p>
				<button onClick={addToList}>Adauga la cartile tale</button>
				<form onSubmit={submitReview}>
					<input type="number" min="1" max="5" name="rating" value={rating} onChange={e => setRating(e.target.value)}/>
					<textarea name="review" onChange={e=>setReview(e.target.value)}></textarea>
					<input type="submit" value="Adauga review" />
				</form>
				<ul>
					{/* {reviews.map(review=><li>{review.rating} | {review.comment}</li>)} */}
					{reviews.map(review=><li>{review.rating} {review.comment ? ' | ': ''} {review.comment}</li>)}
				</ul>
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