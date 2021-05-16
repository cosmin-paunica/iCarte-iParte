import logo from './logo.svg';
import './App.css';
import NavBar from './Components/NavBar.js'
import Content from './Components/Content.js'
import LoginForm from './Components/LoginForm.js'
import SignUpForm from './Components/SignUpForm.js'
import React, {useEffect, useState} from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
function App() {

  const [user,setUser] = useState(null)

  const loginUser = (user) => {
    setUser(user)
    sessionStorage.user = user
  }

  useEffect(() => {
      sessionStorage.user ? setUser(sessionStorage.user) : setUser(null)
  }, [])

 /*if(!user) {
    return(
      <Router>
        <div className = "App app-background">
          <Route path="/" exact render = {() => (<LoginForm login = {loginUser} />)}/>
          <Route path="/signup" render = {() =>(<SignUpForm login = {loginUser}/>)}/>
        </div>
       </Router>
    )
  }*/

  return (
    <div className="App">
      
      <Content user ={user}/>
      
    </div>
  );
}

export default App;
