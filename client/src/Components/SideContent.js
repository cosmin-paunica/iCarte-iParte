import './SideContent.css'
import React, {useState, useEffect} from 'react'

const SideContent = (props) => {
	const [books,setBooks] = useState([])
	const [groups,setGroups] = useState([])
	const [allGroups,setAllGroups] = useState([])
	useEffect(async()=>{
		let readings = await fetch(`/api/getReadingList`);
		readings = await readings.json();
		console.log("Reading");
		console.log(readings)
		setBooks(readings)

		let groups_data = await fetch(`/api/user/current/groups`) 
		groups_data = await groups_data.json()
		setGroups(groups_data)

		let allGroups_data = await fetch(`/api/groups`)
		allGroups_data = await allGroups_data.json()
		setAllGroups(allGroups_data.filter(g => groups_data.filter(gg => gg.ID_group == g.ID_group).length==0))
		// .filter(e=> API_friends.filter(f=> f.ID_user == e.ID_user).length ==0)
	},[])
	const finishBook = (evt,id_book)=>{
		fetch(`/api/finish/${id_book}`,{method:"POST"}).then(()=>{
			console.log("Terminat carte")
		}).catch(e=>console.log(e));
		evt.target.style.display="none"
	}

	const joinGroup = (evt,id_group,group_name)=>{
		fetch(`/api/join/${id_group}`,{method:"POST"}).then(()=>{
			console.log("Am intrat in group")
		}).catch(e=>console.log(e));
		setGroups(groups => [...groups,{ID_group:id_group,name:group_name}])
		evt.target.parentNode.style.display = "none"
	}
	const leaveGroup = (evt,id_group,group_name)=>{
		fetch(`/api/leave/${id_group}`,{method:"POST"}).then(()=>{
			console.log("Am iesit in group")
		}).catch(e=>console.log(e));
		setAllGroups(groups => [...groups,{ID_group:id_group,name:group_name}])
		evt.target.parentNode.style.display = "none"
	}

	return(
		<div className="sidecontent">
			<h2>My Books</h2>
			<div className="book-container">
			{
				books.map(book=> {
					return <div className="book-readingList">
						<img src={book.thumbnail}/>
						<a className="bookID" href={`/book/${book.ID_book}`}>{book.title}</a> 
						{
							(book.finish_date == null) ? <span className="finishBook" onClick={(evt)=>finishBook(evt,book.ID_book)}>Termina Cartea</span> : 
							<span className="finishedBook">Carte terminata</span> 
						}
					
					</div>})
			}
			</div>
			<h2>My Groups</h2>
			<div className="my-groups">
			{
				groups.map(group => <div className="group"><a href={`/group/${group.ID_group}`}>{group.name}</a><span onClick={(evt)=>leaveGroup(evt,group.ID_group,group.name)}>Leave</span></div>)
			}
			</div>
			<h2>New Groups to Join</h2>
			<div className="more-groups">
			{
				allGroups.map(groupz => <div className="group"><a href={`/group/${groupz.ID_group}`}>{groupz.name}</a><span onClick={(evt)=>joinGroup(evt,groupz.ID_group,groupz.name)}>Join</span></div>)
			}
			</div>
		</div>
	)
}

export default SideContent