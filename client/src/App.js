import logo from './logo.svg';
import './App.css';
import LoginForm from './Components/LoginForm.js'
import React, {useEffect, useState} from 'react'
function App() {

  const [user,setUser] = useState(null)

  const loginUser = (user) => {


    const response = fetch('/api/login', {
        "method":"POST",
        "headers": {
          "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
        },
        "body":user

    }).then(response => response.json())
      .then(response => console.log(response))
  }

  useEffect(() => {

  }, [])

  if(!user) {
    return(
      <div className = "App">
        <h1> iCarte-iParte </h1>
        <LoginForm login = {(user) => {loginUser(user)}}/>
      </div>
    )
  }

  return (
    <div className="App">
      Logged in {user}
    </div>
  );
}

export default App;
