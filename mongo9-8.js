var express = require('express')
var app = express();

//User authentication
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require ('passport-local-mongoose');


var _ = require('lodash');
var mongoose = require('mongoose')
var {mongoose} = require('./db/mongoose.js')
const {MongoClient, ObjectID } = require('mongodb');

//Models
var ToDo = require('./models/todo.js');
var User = require('./models/user.js');

//takes JSON and turns it into an object
//needed for app.post
var bodyParser = require('body-parser');
app.use(bodyParser.json());

//EJS
app.set("view engine", "ejs");

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))

//Needed to delete items
var methodOverride = require("method-override")
app.use(methodOverride("_method"));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//ADDING middleware “{currentUser: req.user}” to all routes, so it can be used in the navbar
app.use(function(req, res, next) { // this makes this available on every route
	res.locals.currentUser = req.user; // whatever is connected to “res.locals” is available in our template
	next();
});

app.get('/', (req, res) => {
	res.render('home.ejs')
});

app.get('/unauthenticated', (req, res) => {
	res.render('unauthenticated.ejs')
});

//Fetching the data inside the database
//Go to postman and use "GET". Type url as localhost:27017/todos 
app.get('/todos', isLoggedIn, (req,res) => {
	ToDo.find().then((todos) => {
		//displays all todos in postman
		res.render("practice.ejs", {todos: todos});
	}, (error) => {
		res.send(error);
	})
});

//(NEW) - Displays form to create a new campground (linked to new.ejs)
app.get("/todos/new", function(req, res) {
	res.render("form.ejs");
});

//Disconnect from Robomongo
//Go to postman and use "POST". Type url as localhost:27017/todos
//Go to body tab > raw > JSON (applicaton/json)
//If you type JSON data into the body in postman, it will display in console  
//For example: { "text" : "This is from postman" }
//Go back to Robomongo. Data is in todos collection
                                                                                                                                        
app.post('/todos', isLoggedIn, (req, res) => {

	// var body = _.pick(req.body, ['text', 'name']);
	//var todo = new ToDo(body)

	//Create a variable for the data
	//This displays whatever is posted from postman
	//For example: { "text" : "This is from postman" }
	//Check robomongo to see if object was posted to the collection
	//console.log(req.body) = { "text" : "This is from postman" }
	var todo = new ToDo ({
		text: req.body.text,
		name: req.body.name,
		//***Needed for edit/delete authorization***
		author: {
			id: req.user.id,
			username: req.user.username
		}
	});

	//Saves the above to the database
	todo.save().then((data) => {
		res.redirect("/todos");	

		//{ _id: 5994fcb22e9350afa53e3d3b, username: 'stebs', __v: 0 }
		console.log(req.user._id)
		console.log(data.author.id)
	}, (error) => {	
		//httpstatuses.com
		res.send(error.name);
	});
});

//Show Page
app.get("/todos/:id", function(req,res){
	//find the campground with provided ID (this finds all data in Mongo database)
	ToDo.findById(req.params.id, function(err, todo){
		if(err){
			} else {
				res.render("show.ejs", {tododata: todo});
			}
	});	
});

//Edit Form
app.get("/todos/:id/edit", checkOwnership, (req, res) => {
	var id = req.params.id
	ToDo.findById(id, (error, foundToDo) => {
		if(error) {
			console.log(error)	
		}
			res.render("edit.ejs", {foundToDo: foundToDo})
	})
});

//Updates Edit form
app.put('/todos/:id', checkOwnership, (req, res) => {
	var id = req.params.id
	//only updates properties with text and name
	var body = _.pick(req.body, ['text', 'name']);
	

	if (!ObjectID.isValid(id)) {
		//.send() = empty body
		return res.status(404).send();
	}
	
	//mongoose way to update {new:true} = returnOriginal: false
	ToDo.findByIdAndUpdate(id, {$set: body}, {$new: true} ).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}
		//displays whole object with updated content
			res.redirect("/todos")
			console.log(req.body.name)
			console.log(req.body.text)
	}).catch((error) => {
		res.status(400).send();
	});

});


//Delete a campground
app.delete("/todos/:id", checkOwnership, function(req, res){
	ToDo.findByIdAndRemove(req.params.id).then(() => {
		res.redirect("/todos")
	}).catch((error) => {
		res.send(error);
	});
});



//Authorization Routes

//Register new User Form
app.get('/register', (req, res) => {
	res.render("register.ejs")
});

//Registers a new user
app.post("/register", function(req,res){
	//Not including the "req.body.password" inside newUser({}) hides the password
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		//if unnable to register, redirect to register.ejs
		if(err) {
			console.log(err);	
		} 
		//else you have logged in, redirect campgrounds page
		passport.authenticate("local")(req, res, function(){
			res.redirect("/todos");
		});
	});
});

//***Logging in with your already registered username
//Show login form
app.get("/login", function(req,res){
	res.render("login.ejs")
});
//Logging in with registered username
//passport.authenticate is middleware to check if you 
//already registered a username
//app.post("/login",middleware, callback)
app.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/todos",
		failureRedirect: "/unauthenticated"
	}), function(req,res) {
});

// ***Logout***
// Displays logout page
app.get('/logout', function(req, res) {
	req.logout();
	//Must redirect to a new page to register a new user
	res.redirect("/");
});


//***Middleware****

//middleware to check if user is logged in
//add to any route you need user to be logged in
function isLoggedIn(req, res, next) {
		if(req.isAuthenticated()) { // if user is logged in, then run next() which
		return next(); // refers to everything after isLoggedIn function
	}
	res.redirect('/unauthenticated'); // else redirect to login page if not logged in 
}


//middleware to check edit, update and destroy ownership
function checkOwnership(req, res, next){
	// is User logged in?
	if (req.isAuthenticated){
				//if yes, then...
				ToDo.findById(req.params.id, function(err, user) { // finds all Blogs in database
					if(err){
						res.direct('back');
					} else {
						// does the user own the blog? If yes....
						if (user.author.id.equals(req.user._id)) {
						next();
					} else {
						// If no....
						res.send('You do not have permission to do that')
					}

					}
			});
		}
}

//Runs on PORT localhost:27017
var PORT = process.env.PORT || 5000
app.listen(PORT, function(){
  console.log('Server Running');
});