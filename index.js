const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(cors())

app.use(express.static(path.join(__dirname, 'client/build')))

app.use(session({
	secret: process.env.SECRET_SESSION_KEY || "gherutz",
	resave: true,
	saveUninitialized: false
}));

app.post('/api/login', urlencodedParser, async (req, res) => {		// will make a call to the database and create a session if the user entered corect credentials
																// otherwise will return a message
	//console.log(req.body)
	//console.log(`username-ul este ${req.body.username}`)
	//console.log(`parola este ${req.body.password}`)
	req.session.username = req.body.username
	res.json({"response":"OK"})
})

app.get('/api/book/:bookId', (req,res) => {
	res.json({"response":"API CALL RESPONSE FOR A CERTAIN BOOK ID"}) // will return a single book with the id of bookId
})

app.get('/api/books/:bookSearchString', (req,res) => {
	res.json({"response":"API CALL RESPONSE FOR SEARCHING A BOOK"}) // will return a list of books that match bookSearchString
	// all the filtering paramteres (such as sorting by release date, or rating) will be found in req.params
})

app.get('/api/user/:userId', (req, res) => {
	res.json({"response" :"API CALL RESPONSE FOR A CERTAIN USER ID"}) //will return a single user with the id of userId
})

app.get('/api/users/:userSearchString', (req, res) => {
	res.json({"response": "API CALL RESPONSE FOR SEARCHING A USER"}) // will return a list of users that match userSearchString
	// all the filtering parametes (such as sorting alphabetically) will be found in req.params
})

app.get('/api/group/:groupId', (req, res) => {
	res.json({"response":"API CALL RESPONSE FOR A CERTAIN GROUP"}) // will return a single group with the id if groupId
})

app.get('/api/groups/:groupSearchString', (req, res) => {
	res.json({"response":"API CALL FOR SEARCHING A GROUP"}) // will return a list of groups that match groupSearchString
	// all the filtering paramteres (such as sorting by number of members) will be found in req.params
})



app.get('/*',(req,res)=>{
	res.sendFile(path.join(__dirname+'/client/build/index.html'))
})


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {console.log(`App listening on port ${PORT}`)})