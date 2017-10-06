var express = require('express')
var app = express();

//User authentication
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require ('passport-local-mongoose');


var _ = require('lodash');
var {mongoose} = require('./db/mongoose.js')
const {MongoClient, ObjectID } = require('mongodb');

//Models
var {ToDo} = require('./models/todo.js');
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
                                                                                                                                        
app.post('/todos', (req, res) => {
	console.log(req.body.email)
	var body = _.pick(req.body, ['text', 'name']);
	
	//Create a variable for the data
	//This displays whatever is posted from postman
	//For example: { "text" : "This is from postman" }
	//Check robomongo to see if object was posted to the collection
	//console.log(req.body) = { "text" : "This is from postman" }
	var todo = new ToDo (body);

	//Saves the above to the database
	todo.save().then((data) => {
		res.redirect("/todos");	
		
	}, (error) => {	
		//httpstatuses.com
		res.send(error);
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

//Delete a campground
app.delete("/todos/:id", function(req, res){
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
			console.log(user)
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

//middleware to check if user is logged in
//add to any route you need user to be logged in
function isLoggedIn(req, res, next) {
		if(req.isAuthenticated()) { // if user is logged in, then run next() which
		return next(); // refers to everything after isLoggedIn function
	}
	res.redirect('/unauthenticated'); // else redirect to login page if not logged in 
}

//Runs on PORT localhost:27017
var PORT = process.env.PORT || 5000
app.listen(PORT, function(){
  console.log('Server Running');
});