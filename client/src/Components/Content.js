import './Content.css'
import FriendList from './FriendList.js'
import Feed from './Feed.js'
import SideContent from './SideContent.js'
import Book from './Book.js'
import React, {useEffect,useState} from 'react'
import NavBar from './NavBar.js'
import SearchResult from './SearchResult.js'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
const Content = (props) => {
	

	return (
		<div className = "content" >
			<SideContent user={props.user}/>
			<Router>
				<NavBar user = {props.user} />
				<Route path = "/" exact render = {() => (<Feed user ={props.user} />)} />
				<Route path = "/book/:id" render = {(props) => (<Book {...props} />)} />
				<Route path = "/search/:searchString" render = {(props) => (<SearchResult {...props} location = {window.location.pathname} key={window.location.pathname}/>)}/>
			</Router>
			<FriendList user ={props.user}/>
		</div>
	)

}

export default Content