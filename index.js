const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const {google} = require('googleapis')
const {db} = {} //require('./config/db.js')

const books = google.books({
	version:'v1',
	auth:process.env.API_KEY
})

const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({ extended: true }));

require('dotenv').config()
app.use(cors())
app.use(express.static(path.join(__dirname, 'client/build')))

app.use(session({
	secret: process.env.SECRET_SESSION_KEY || "gherutz",
	resave: true,
	saveUninitialized: false
}));

app.post('/api/login', bodyParser.json(), async (req, res) => {		// will make a call to the database and create a session if the user entered corect credentials
																// otherwise will return a message
	//console.log(req.body)
	//console.log(`username-ul este ${req.body.username}`)
	//console.log(`parola este ${req.body.password}`)

	const username = req.body.username
	const password = req.body.password
	const userInDB = await db.query(`SELECT * FROM users WHERE "username" = $1`,[username]) 
	if(userInDB.rowCount && ((bcrypt.compareSync(password,userInDB.rows[0].password)))){
			//the user provided good credentials
			req.session.username = req.body.username
			res.status(200).json({message:"User logged in"})
	}
	else{
		res.status(401).json({message:"Wrong username or password"});
	}
	
})

app.get('/api/book/:bookId', async (req,res) => {
	// will return a single book with the id of bookId
	const data = await books.volumes.get({volumeId:req.params["bookId"]}) 
	res.json(data) 
})

app.get('/api/books/:bookSearchString', async (req,res) => {
	// will return a list of books that match bookSearchString
	// all the filtering paramteres (such as sorting by release date, or rating) will be found in req.params
	const booksReturned = await books.volumes.list({q:req.params["bookSearchString"]})
	const data = booksReturned.data.items.filter(book => book.volumeInfo.readingModes.image==true)
	res.json(data)
})

app.get('/api/user/:userId', async (req, res) => {
	//will return a single user with the id of userId
	const data = await db.query(`SELECT * FROM users WHERE "ID_user" = $1`,[req.params["userId"]]);
	res.json(data.rows)
})

app.get('/api/users/:userSearchString', async (req, res) => {
  // will return a list of users that match userSearchString
	// all the filtering parametes (such as sorting alphabetically) will be found in req.params
	const data = await db.query(`SELECT * FROM users WHERE "username" LIKE $1`,["%"+req.params["userSearchString"]+"%"]);
	res.json(data.rows)
})

app.get('/api/group/:groupId', async (req, res) => {
	 // will return a single group with the id if groupId
	const data = await db.query(`SELECT * FROM groups WHERE "ID_group" = $1`,[req.params["groupId"]]);

	res.json(data.rows[0])
})

app.get('/api/groups/:groupSearchString', async (req, res) => {
  // will return a list of groups that match groupSearchString
	// all the filtering paramteres (such as sorting by number of members) will be found in req.params
	const data = await db.query(`SELECT * FROM groups WHERE "name" LIKE $1`,["%"+req.params["groupSearchString"]+"%"]);
	res.json(data.rows)
})

app.post("/api/user",bodyParser.json(),(req,res)=>{
	const salt= bcrypt.genSaltSync(10)
	const username = req.body.username;
	const password = bcrypt.hashSync(req.body.password,salt)
	const email = req.body.email;
	db.query(`INSERT INTO public.users(username, email, password)
		VALUES ($1,$2,$3);`,[username,email,password]).then((queryResult)=>{
			res.status(200).json({message:"User added in DB"})
		}).catch(e =>{
			console.error(e.stack)
			res.status(500).json({message:"Error inserting into DB"})
		})
	
})


app.get('/*',(req,res)=>{
	res.sendFile(path.join(__dirname+'/client/build/index.html'))
})


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {console.log(`App listening on port ${PORT}`)})