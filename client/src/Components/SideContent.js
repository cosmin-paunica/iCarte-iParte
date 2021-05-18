import './SideContent.css'
import React, {useState, useEffect} from 'react'

const SideContent = (props) => {
	const [books,setBooks] = useState([])
	useEffect(async()=>{
		let readings = await fetch(`api/getReadingList`);
		readings = await readings.json();
		console.log("Reading");
		console.log(readings)
		setBooks(readings)
	},[])
	const finishBook = (id_book)=>{
		fetch(`api/finish/${id_book}`,{method:"POST"}).then(()=>{
			console.log("TErminat carte")
		}).catch(e=>console.log(e));
	}
	return(
		<div className="sidecontent">
			<h3>My Books</h3>
			{
				books.map(e=> {
					return <div>
						<p>{e.ID_book}</p> 
						{
							(e.finish_date == null) && <span onClick={()=>finishBook(e.ID_book)}>Termina Cartea</span>
						}
					
					</div>})
			}
		</div>
	)
}

export default SideContent