const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const {google} = require('googleapis')
const {db} = require('./config/db.js')
const { info } = require('console')
const {checkSignUpInput} = require('./utilities/validations')


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
/**
 * Returns a list of all the groups present in the database
 */
app.get('/api/groups',async(req,res)=>{
	const data = await db.query(`SELECT * FROM "public"."groups"`);
	res.json(data.rows);
})
/**
 * Creates a group in the database with the data provided in body
 */
app.post('/api/groups',jsonParser,async(req,res)=>{
	const groupName = req.body.name;
	const groupDescription = req.body.description;
	// const idAdmin = await db.query(`SELECT "ID_user" FROM users WHERE username = $1`,[req.session.username]);
	//TODO get id from req
	const idAdmin = 1;
	try{
		const resQuery = await db.query(`INSERT INTO groups(name,description,"ID_Admin") VALUES ($1,$2,$3)`,[groupName,groupDescription,idAdmin]);
		console.log(resQuery.rows);
		res.status(200).json({message:"Added group into DB"})
	}catch(err){
		console.log(err.stack)
		res.status(500).json({message:err.stack});
	}
})
/**
 * Recieves a group in body of the request and edits it in the database
 */
app.put('/api/groups',jsonParser,async(req,res)=>{
	const groupID = req.body.ID_group;
	const resQuery = await db.query(`SELECT * FROM groups WHERE "ID_group" = $1`,[groupID]);
	if(resQuery.rowCount == 0){
		return res.status(500).json({message:"Therese no group with that ID to be edited"});
	}
	const updatedName = req.body.name;
	const updatedDescripton = req.body.description;
	// if(resQuery.rows[0].ID_Admin != req.session.username){
	//TODO get id fron req
	if(resQuery.rows[0].ID_Admin != 1){
		return res.status(500).json({message:"You don't have authority to modify this group"});
	} 

	try{
		await db.query(`UPDATE groups SET name = $1, description = $2 WHERE "ID_group" = $3`,[updatedName,updatedDescripton,groupID]);
		res.status(200).json({message:"Group updated"});
	}catch(err){
		console.log(err.stack);
		res.status(500);
	}
})

/**
 * Deletes a group with ID specified in url
 */
app.delete('/api/groups/:groupID',async(req,res)=>{
	const data = await db.query(`SELECT * FROM groups WHERE "ID_group" = $1`,[req.params["groupID"]]);
	if(data.rowCount == 0){
		return res.status(500).json("No group with that ID in database");
	}
	// const idUser = await db.query(`SELECT "ID_user" FROM users WHERE username = $1`,[req.session.username]);
	const idUser =1;
	if(data.rows[0].ID_Admin != idUser){
		return res.status(500).json({message:"You cant delete this group"});
	}
	try{
		const resQuery = await db.query(`DELETE FROM groups WHERE "ID_group" = $1`,[req.params["groupID"]]);
		res.sendStatus(200); 
	}catch(err){
		res.sendStatus(500);
		console.log(err.stack);
	}
})


app.post("/api/user",bodyParser.json(), async (req,res)=>{
	const salt= bcrypt.genSaltSync(10)
	const username = req.body.username;
	const password = bcrypt.hashSync(req.body.password,salt)
	const email = req.body.email;

	let flag = true

	const queryEmail = await db.query('SELECT * FROM users WHERE email = $1', [email])
	if (queryEmail.rowCount != 0){

		flag = false
	}
	const queryUsername = await db.query('SELECT * FROM users WHERE username = $1', [username])
	if (queryUsername.rowCount != 0){

		flag = false
	}

	if(flag){
		db.query(`INSERT INTO public.users(username, email, password)
		VALUES ($1,$2,$3);`,[username,email,password]).then((queryResult)=>{
			res.status(200).json({message:"User added in DB"})
		}).catch(e =>{
			console.error(e.stack)
			res.status(500).json({message:"Error inserting into DB"})
		})
	}else {
		res.status(500).json({message:"User already exists !"})
	}
	
	
})


app.get('/*', (req,res)=>{
	res.sendFile(path.join(__dirname+'/client/build/index.html'))
})


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {console.log(`App listening on port ${PORT}`)})