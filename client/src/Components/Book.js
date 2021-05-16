import './Book.css'
import React, {useEffect,useState} from 'react'
const Book = (props) => {

	const {id} = props.match.params

	useEffect(()=>{
		// will make call to API but we will hardcode this for now
	},[])

	return(
		<div className = "book">
			{id}
		</div>
	)

}

export default Book