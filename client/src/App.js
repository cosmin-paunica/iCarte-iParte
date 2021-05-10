import logo from './logo.svg';
import './App.css';
import LoginForm from './Components/LoginForm.js'
import SignUpForm from './Components/SignUpForm.js'
import React, {useEffect, useState} from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
function App() {

  const [user,setUser] = useState(null)
  const [error, setError] = useState(null)
  const loginUser = (user) => {

    const username = user.split("&")[0].split("=")[1]
    const password = user.split("&")[1].split("=")[1]

    if(password && username && password.trim() !== "" && username.trim() !== "") {
        const response = fetch('/api/login', {
            "method":"POST",
            "headers": {
              "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
            },
            "body":user

        }).then(response => response.json())
          .then(response => {
            if(response.response === "OK") {
              setUser(username)
              sessionStorage.user = username
            }else {
              setError("Invalid credentials")
            }
          })      
      }else {
        setError("Please fill the fields")
      }


  }

  useEffect(() => {
      sessionStorage.user ? setUser(sessionStorage.user) : setUser(null)
  }, [])

  if(!user) {
    return(
      <Router>
        <div className = "App">
          <Route path="/login" component = {LoginForm}/>
          <Route path="/signup" component = {SignUpForm} />
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
