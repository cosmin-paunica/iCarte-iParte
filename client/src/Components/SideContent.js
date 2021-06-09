import './SideContent.css'
import React, {useState, useEffect} from 'react'

const SideContent = (props) => {
	const [books,setBooks] = useState([])
	useEffect(async()=>{
		let readings = await fetch(`/api/getReadingList`);
		readings = await readings.json();
		console.log("Reading");
		console.log(readings)
		setBooks(readings)
	},[])
	const finishBook = (evt,id_book)=>{
		fetch(`/api/finish/${id_book}`,{method:"POST"}).then(()=>{
			console.log("Terminat carte")
		}).catch(e=>console.log(e));
		evt.target.style.display="none"
	}
	return(
		<div className="sidecontent">
			<h3>My Books</h3>
			{
				books.map(book=> {
					return <div>
						<a className="bookID" href={`/book/${book.ID_book}`}>{book.ID_book}</a> 
						{
							(book.finish_date == null) ? <span className="finishBook" onClick={(evt)=>finishBook(evt,book.ID_book)}>Termina Cartea</span> : 
							<span className="finishedBook">Carte terminata</span> 
						}
					
					</div>})
			}
		</div>
	)
}

export default SideContent