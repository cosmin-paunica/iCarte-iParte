import logo from './logo.svg';
import './App.css';
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

  if(!user) {
    return(
      <Router>
        <div className = "App">
          <Route path="/" exact render = {() => (<LoginForm login = {loginUser} />)}/>
          <Route path="/signup" render = {() =>(<SignUpForm login = {loginUser}/>)}/>
        </div>
       </Router>
    )
  }

  return (
    <div className="App">
      Logged in as {user}
    </div>
  );
}

export default App;
