import './Content.css'
import FriendList from './FriendList.js'
import Feed from './Feed.js'
import SideContent from './SideContent.js'
import React, {useEffect,useState} from 'react'
const Content = (props) => {
	

	return (
		<div className = "content" >
			<SideContent user={props.user}/>
			<Feed user ={props.user}/>
			<FriendList user ={props.user}/>
		</div>
	)

}

export default Content