import './Content.css'
import FriendList from './FriendList.js'
import Feed from './Feed.js'
import SideContent from './SideContent.js'
import Book from './Book.js'
import SearchResult from './SearchResult.js'
import NavBar from './Navbar.js'
import React, {useEffect,useState} from 'react'
import NavBar from './NavBar.js'
import SearchResult from './SearchResult.js'
import UserProfile from './UserProfile.js'
import Group from './Group.js'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

const Content = (props) => {
	

	return (
		<div className = "content" >
			<SideContent user={props.user}/>
			<Router>
				<NavBar user = {props.user} />
				<Route path = "/user/:id" render = {(props) => (<UserProfile {...props} />)} />
				<Route path = "/book/:id" render = {(props) => (<Book {...props} />)} />
				<Route path = "/group/:id" render = {(props) => (<Group {...props}/>)} />
				<Route path = "/search/:searchString" render = {(props) => (<SearchResult {...props} location = {window.location.pathname} key={window.location.pathname}/>)}/>
				<Route path = "/" exact render = {() => (<Feed user ={props.user} />)} />
				<Route path = "/signup"  render = {() => (<Feed user ={props.user} />)} />
			</Router>
			<FriendList user ={props.user}/>
		</div>
	)

}

export default Content