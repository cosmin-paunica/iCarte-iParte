const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const {google, dlp_v2} = require('googleapis')
const {db} = require('./config/db.js')
const { info } = require('console')
const {checkSignUpInput} = require('./utilities/validations')
const e = require('express')


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
	console.log(req.params["bookSearchString"])
	// will return a list of books that match bookSearchString
	// all the filtering paramteres (such as sorting by release date, or rating) will be found in req.params
	const booksReturned = await books.volumes.list({q:req.params["bookSearchString"]})
	const data = booksReturned.data.items.filter(book => book.volumeInfo.readingModes.image==true)
	res.json(data)
})
/**
 * Get all users
 */
app.get('/api/user', async (req, res) => {
	//will return a single user with the id of userId
	const data = await db.query(`SELECT * FROM users`);
	res.json(data.rows)
})

app.get('/api/user/:userId', async (req, res) => {
	//will return a single user with the id of userId
	const data = await db.query(`SELECT * FROM users WHERE "ID_user" = $1`,[req.params["userId"]]);
	res.json(data.rows)
})

/**
 * Returns the groups that a user is part of
 * 
 */
 app.get('/api/user/:userId/groups', async (req, res) => {
	const data = await db.query(`SELECT * FROM users WHERE "ID_user" = $1`,[req.params["userId"]]);
	if(data.rowCount === 0){
		return res.status(500).json({message:"Not a user with that ID"});
	}
	try{
		const groups = await db.query(`SELECT "ID_group" FROM users_group WHERE "ID_user" = $1`,[req.params["userId"]]);
		let arrOfGroups = [];
		groups.rows.forEach((el)=>{
			arrOfGroups.push(parseInt(el.ID_group));
		})
		res.status(200).json(arrOfGroups);
	}catch(err){
		console.log(err.stack);
		return res.status(500);
	}
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
 * Returns a list of IDs corresponding to users in specified group
 */
app.get('/api/group/:groupID/users',async(req,res)=>{
	const data = await db.query(`SELECT * FROM groups WHERE "ID_group" = $1`,[req.params["groupID"]]);
	if(data.rowCount === 0){
		return res.status(500).json({message:"Not a group with that ID"});
	}
	try{
		const users = await db.query(`SELECT "ID_user" FROM users_group WHERE "ID_group" = $1`,[req.params["groupID"]]);
		let arrOfUsers = [];
		users.rows.forEach((el)=>{
			arrOfUsers.push(parseInt(el.ID_user));
		})
		res.status(200).json(arrOfUsers);

	}catch(err){
		console.log(err.stack);
		return res.status(500);
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
/**
 * Returnsa ll the reviews for every book in Database
 */
app.get("/api/reviews",async(req,res)=>{
	const data = await db.query("SELECT * FROM reviews");
	res.status(200).json(data.rows);
})

/**
 * Returns a singe review
 */
app.get("/api/reviews/:reviewID",async(req,res)=>{
	const data = await db.query(`SELECT * FROM reviews WHERE "ID_review" = $1`,[req.params["reviewID"]]);
	res.status(200).json(data.rows);
})

/**
 * Returns tha reviews for a single book
 */
app.get("/api/reviews/book/:bookID",async(req,res)=>{
	const data = await db.query(`SELECT * FROM reviews WHERE "ID_carte" = $1`,[req.params["bookID"]]);
	res.status(200).json(data.rows);
})

/**
 * Returns reviews made by a specific user
 */
 app.get("/api/reviews/user/:userID",async(req,res)=>{
	const data = await db.query(`SELECT * FROM reviews WHERE "ID_user" = $1`,[req.params["userID"]]);
	res.status(200).json(data.rows);
})

/**
 * Adds a review to the Database using the logged in user
 */
app.post("/api/reviews",jsonParser,async(req,res)=>{
	const bookID = req.body.ID_carte;
	const comment = req.body.comment;
	const rating = req.body.rating;
	let loggedInUserID = await db.query("SELECT * FROM users WHERE username LIKE $1",[req.session.username]);
	console.log(req.session.username)
	if(loggedInUserID.rowCount == 0){
		return res.sendStatus(500);
	}else{
		loggedInUserID = loggedInUserID.rows[0].ID_user;
	}
	try{
		const resQuery = db.query(`INSERT INTO reviews("ID_carte",comment,rating,"ID_user") VALUES ($1,$2,$3,$4)`,[bookID,comment,rating,loggedInUserID])
		res.status(200).json({message:"Review added"});
	}catch(err){
		console.log(err.stack);
		res.sendStatus(500);
	}
	

})

/**
 * Edits a review
 */
app.put("/api/reviews",jsonParser,async(req,res)=>{
	const reviewID = req.body.ID_review;
	const resQuery = await db.query(`SELECT * FROM reviews WHERE "ID_review" = $1`,[reviewID]);
	if(resQuery.rowCount == 0){
		return res.status(500).json({message:"No review with that ID"});
	}
	const updatedComment = req.body.comment;
	const updatedRating = req.body.rating;
	let loggedInUserID = await db.query("SELECT * FROM users WHERE username LIKE $1",[req.session.username]);
	console.log(req.session.username)
	if(loggedInUserID.rowCount == 0){
		return res.sendStatus(500);
	}else{
		loggedInUserID = loggedInUserID.rows[0].ID_user;
	}
	if(resQuery.rows[0].ID_user!= loggedUserID){
		return res.status(500).json({message:"YOu dont have acces to modify this review"});
	}
	try{
		const resQuery = await db.query(`UPDATE reviews SET comment = $1,rating = $2 WHERE "ID_review" = $3`,[updatedComment,updatedRating,reviewID]);
		res.status(200).json({message:"Review updated"});
	}catch(err){
		console.log(err.stack);
		res.sendStatus(500);
	}
})

/**
 * Deletes a specified review
 */
app.delete("/api/reviews/:reviewID",async(req,res)=>{
	const data = await db.query(`SELECT * FROM reviews WHERE "ID_review" = $1`,[req.params["reviewID"]]);
	if(data.rowCount == 0){
		return res.status(500).json("No review with that ID in database");
	}
	let loggedInUserID = await db.query("SELECT * FROM users WHERE username LIKE $1",[req.session.username]);
	console.log(req.session.username)
	if(loggedInUserID.rowCount == 0){
		return res.sendStatus(500);
	}else{
		loggedInUserID = loggedInUserID.rows[0].ID_user;
	}
	if(data.rows[0].ID_user != loggedInUserID){
		return res.status(500).json({message:"You cant delete this review"});
	}
	try{
		const resQuery = await db.query(`DELETE FROM REVIEWS WHERE "ID_review" = $1`,[req.params["reviewID"]]);
		res.status(200).json({message:"Review deleted"});
	}catch(err){
		console.log(err.stack);
		res.sendStatus(500);
	}
})

/**
 * User marks a book as "started reading"
 */
app.post("/api/reading/:bookID",async (req,res)=>{
	const bookID = req.params["bookID"];
	// const loggedInUserID = await db.query("SELECT * FROM users WHERE username = $1",[req.session.username]);
	let loggedInUserID = await db.query("SELECT * FROM users WHERE username LIKE $1",[req.session.username]);
	console.log(req.session.username)
	if(loggedInUserID.rowCount == 0){
		return res.sendStatus(500);
	}else{
		loggedInUserID = loggedInUserID.rows[0].ID_user;
	}
	const isReadingAlready = await db.query(`SELECT * FROM books_read WHERE "ID_user" = $1 AND "ID_book" = $2`,[loggedInUserID,bookID]);
	if(isReadingAlready.rowCount != 0){
		return res.status(500).json({message:"Already reading this book"});
	}
	try{
		const resQuery = await db.query(`INSERT INTO books_read VALUES($1,$2,$3,$4)`,[loggedInUserID,bookID,new Date(),null]);
		res.sendStatus(200);
	}catch(err){
		console.log(err.stack);
		res.sendStatus(500);
	}
})
/**
 * If it finds a book in process of reading it sets a finish date, else inserts a new book with a finish date set
 */
app.post("/api/finish/:bookID",async (req,res)=>{
	const bookID = req.params["bookID"];
	let loggedInUserID = await db.query("SELECT * FROM users WHERE username LIKE $1",[req.session.username]);
	console.log(req.session.username)
	if(loggedInUserID.rowCount == 0){
		return res.sendStatus(500);
	}else{
		loggedInUserID = loggedInUserID.rows[0].ID_user;
	}
	const isReadingAlready = await db.query(`SELECT * FROM books_read WHERE "ID_user" = $1 AND "ID_book" = $2`,[loggedInUserID,bookID]);
	if(isReadingAlready.rowCount == 0){
		/* if a book is marked as finished but never started, insert a row with start date and end date matching since the user might already read the book  */
		try{
			const resQuery = await db.query(`INSERT INTO books_read VALUES($1,$2,$3,$4)`,[loggedInUserID,bookID,new Date(),new Date()]);
			res.sendStatus(200);
		}catch(err){
			console.log(err.stack);
			res.sendStatus(500);
		}
	}else{
		try{
			const resQuery = await db.query(`UPDATE books_read SET "finish_date" = $1 WHERE "ID_user" = $2 AND "ID_book" = $3`,[new Date(),loggedInUserID,bookID]);
			res.sendStatus(200);
		}catch(err){
			console.log(err.stack);
			res.sendStatus(500);
		}
	}
	
})
/**
 * REtrieves all tha books tracked for the current user
 * ! This should be /api/user/readings but conflicts with the route above, should rename more sugestive
 */
app.get("/api/getReadingList/",async(req,res)=>{
	// const loggedInUserID = await db.query("SELECT * FROM users WHERE username = $1",[req.session.username]);
	let loggedInUserID = await db.query("SELECT * FROM users WHERE username LIKE $1",[req.session.username]);
	console.log(req.session.username)
	if(loggedInUserID.rowCount == 0){
		return res.sendStatus(500);
	}else{
		loggedInUserID = loggedInUserID.rows[0].ID_user;
	}

	let data = await db.query(`SELECT * FROM "books_read" WHERE "ID_user" = $1`,[loggedInUserID]);
	let rows = await Promise.all(data.rows.map(async(e)=>{
		let book_info = (await books.volumes.get({volumeId:e.ID_book})).data;
		e.title =  book_info.volumeInfo.title;
		e.thumbnail =  book_info.volumeInfo.imageLinks.thumbnail
		return e
	}))

	
	res.status(200).json(rows);
})

/**
 * Current logged user follows another user
 */
app.post("/api/follow/:followID",async(req,res)=>{
	const followID= req.params["followID"];
	let loggedInUserID = await db.query("SELECT * FROM users WHERE username LIKE $1",[req.session.username]);
	console.log(req.session.username)
	if(loggedInUserID.rowCount == 0){
		return res.sendStatus(500);
	}else{
		loggedInUserID = loggedInUserID.rows[0].ID_user;
	}
	const alreadyFollow = await db.query(`SELECT * FROM followage WHERE "ID_user" =$1 AND "ID_friend" = $2`,[loggedInUserID,followID])
	if(alreadyFollow.rowCount != 0)
	{
		res.sendStatus(500);
	}else{
		try{
			await db.query(`INSERT INTO followage VALUES ($1,$2,$3,$4)`,[loggedInUserID,followID,true,null]);
			res.status(200).json({message:"Succes"});
		}catch(err){
			res.send(err.stack);
		}
	}
})

/**
 * Current logged user accept a follow from specified user ID
 */
app.post("/api/accept/:followID",async(req,res)=>{
	const followID= req.params["followID"];
	let loggedInUserID = await db.query("SELECT * FROM users WHERE username LIKE $1",[req.session.username]);
	console.log(req.session.username)
	if(loggedInUserID.rowCount == 0){
		return res.sendStatus(500);
	}else{
		loggedInUserID = loggedInUserID.rows[0].ID_user;
	}
	try{
		const resQuery = await db.query(`UPDATE followage SET pending = $1 , "accept_date" = $2 WHERE "ID_user" = $3 AND "ID_friend" = $4`,[false,new Date(),followID,loggedInUserID]);
		if(resQuery.rowCount == 0){
			return res.status(500).json({message:"There is no invitation from that user"});
		}else{
			return res.status(200).json({message:"Follow request accepted"});
		}
	}catch(err)
	{
		console.log(err.stack);
		res.status(500).json({message:"Something went wrong"});
	}
})

/**
 * Removes a follow connection between the current user and the spcified user;
 */
app.post("/api/unfollow/:userID",async(req,res)=>{
	const followID= req.params["userID"];
	let loggedInUserID = await db.query("SELECT * FROM users WHERE username LIKE $1",[req.session.username]);
	console.log(req.session.username)
	if(loggedInUserID.rowCount == 0){
		return res.sendStatus(500);
	}else{
		loggedInUserID = loggedInUserID.rows[0].ID_user;
	}
	try{
		const resQuery = await db.query(`DELETE FROM followage WHERE "ID_user" = $1 AND "ID_friend" = $2 `,[loggedInUserID,followID]);
		// console.log(resQuery);
		res.sendStatus(200);
	}catch(err){
		console.log(err.stack);
		res.status(500).json({message:"Something went wrong"})
	}
})

/**
 * Returns a list of followers for the current logged in user
 */
app.get("/api/followers",async(req,res)=>{
	// const loggedInUserID = 3;
	let loggedInUserID = await db.query("SELECT * FROM users WHERE username LIKE $1",[req.session.username]);
	console.log(req.session.username)
	if(loggedInUserID.rowCount == 0){
		return res.sendStatus(500);
	}else{
		loggedInUserID = loggedInUserID.rows[0].ID_user;
	}
	const data = await db.query(`SELECT f."ID_user",pending,accept_date,username,email FROM followage f JOIN users u ON f."ID_user" = u."ID_user" WHERE f."ID_friend" = $1`,[loggedInUserID]);
	res.status(200).json(data.rows);
})

/**
 * Returns a list of all the people that follow the current logged in user
 */
app.get("/api/following",async(req,res)=>{
	let loggedInUserID = await db.query("SELECT * FROM users WHERE username LIKE $1",[req.session.username]);
	console.log(req.session.username)
	if(loggedInUserID.rowCount == 0){
		return res.sendStatus(500);
	}else{
		loggedInUserID = loggedInUserID.rows[0].ID_user;
	}
	const data = await db.query(`SELECT u."ID_user",pending,accept_date,username,email FROM followage f JOIN users u ON f."ID_friend" = u."ID_user" WHERE f."ID_user" = $1`,[loggedInUserID]);
	res.status(200).json(data.rows);

})
/**
 * Returns a list of all the posts that have been made in a group
 */
app.get("/api/group_posts/:groupID", async(req, res) => {
	const data = await db.query(`SELECT "ID_user","ID_post","ID_group","post_timestamp","post_text",username,email 
															 FROM "public"."posts" JOIN "public"."users" 
															 USING ("ID_user") WHERE "ID_group" = $1`,[req.params["groupID"]]);
	res.status(200).json(data.rows)
})

/**
 * Adds a group post in the db
 */
app.post("/api/group_posts",async(req,res)=>{
	const ID_group = req.body.ID_group;
	const post_text = req.body.post_text;
	let loggedInUserID = await db.query("SELECT * FROM users WHERE username LIKE $1",[req.session.username]);
	console.log(req.session.username)
	if(loggedInUserID.rowCount == 0){
		return res.sendStatus(500);
	}else{
		loggedInUserID = loggedInUserID.rows[0].ID_user;
	}
	try{
		const resQuery = db.query(`INSERT INTO posts("ID_user","ID_group","post_text") VALUES ($1,$2,$3)`,[loggedInUserID,ID_group,post_text])
		res.status(200).json({message:"Post added"});
	}catch(err){
		console.log(err.stack);
		res.sendStatus(500);
	}
})

/**
 * Edits a group post
 */
app.put("/api/group_posts",async(req,res)=>{
	const ID_post = req.body.ID_post 
	const resQuery = await db.query(`SELECT * FROM posts WHERE "ID_post" = $1`,[ID_post]);
	if(resQuery.rowCount == 0){
		return res.status(500).json({message:"No post with that ID"});
	}
	const updated_text = req.body.post_text;
	let loggedInUserID = await db.query("SELECT * FROM users WHERE username LIKE $1",[req.session.username]);
	// let loggedInUserID = 1
	console.log(req.session.username)
	if(loggedInUserID.rowCount == 0){
		return res.sendStatus(500);
	}else{
		loggedInUserID = loggedInUserID.rows[0].ID_user;
	}
	if(resQuery.rows[0].ID_user!= loggedInUserID){
		return res.status(500).json({message:"You dont have acces to modify this post"});
	}
	try{
		const resQuery = await db.query(`UPDATE posts SET "post_text" = $1 WHERE "ID_post" = $2`,[updated_text,ID_post]);
		res.status(200).json({message:"Post updated"});
	}catch(err){
		console.log(err.stack);
		res.sendStatus(500);
	}
})

/**
 * Deletes a post
 */
app.delete("/api/group_posts/:postID",async(req,res)=>{
	const data = await db.query(`SELECT * FROM posts WHERE "ID_post" = $1`,[req.params["postID"]]);
	if(data.rowCount == 0){
		return res.status(500).json("No post with that ID in database");
	}	
	let loggedInUserID = await db.query("SELECT * FROM users WHERE username LIKE $1",[req.session.username]);
	if(loggedInUserID.rowCount == 0){
		return res.sendStatus(500);
	}else{
		loggedInUserID = loggedInUserID.rows[0].ID_user;
	}
	if(data.rows[0].ID_user != loggedInUserID){
		return res.status(500).json({message:"You cant delete this review"});
	}
	try{
		const resQuery = await db.query(`DELETE FROM posts WHERE "ID_post" = $1`,[req.params["postID"]]);
		res.status(200).json({message:"Post deleted"});
	}catch(err){
		console.log(err.stack);
		res.sendStatus(500);
	}
})

app.get('/*', (req,res)=>{
	res.sendFile(path.join(__dirname+'/client/build/index.html'))
})


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {console.log(`App listening on port ${PORT}`)})