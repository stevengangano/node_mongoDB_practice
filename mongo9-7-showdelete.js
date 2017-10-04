//POSTING DATA

var _ = require('lodash');
var {mongoose} = require('./db/mongoose.js')
const {MongoClient, ObjectID } = require('mongodb');
//Models
var {ToDo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var express = require('express')
var app = express();
//takes JSON and turns it into an object
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.set("view engine", "ejs");
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))

var methodOverride = require("method-override")
app.use(methodOverride("_method"));


//Fetching the data
//Go to postman and use "GET". Type url as localhost:27017/todos 
app.get('/todos', (req,res) => {
	ToDo.find().then((todos) => {
		//displays all todos in postman
		res.render("practice.ejs", {todos: todos});
		console.log(todos)
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
	
	//Create a variable for the data
	//This displays whatever is posted from postman
	//For example: { "text" : "This is from postman" }
	//Check robomongo to see if object was posted to the collection
	//console.log(req.body) = { "text" : "This is from postman" }
	var todo = new ToDo ({
		//This grabs the text property value
		//required
		name: req.body.name,
		//required
		text: req.body.text
	});

	//Saves the above to the database
	todo.save().then((data) => {
		res.redirect("/todos");	
		console.log(data)
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
				res.render("show.ejs", {data: todo});
			}
	});	
});


//Delete a campground
//to delete all campgrouds "db.campgrounds.drop()"
app.delete("/todos/:id", function(req, res){
	ToDo.findByIdAndRemove(req.params.id, function(err){
		if(err) {
			res.redirect("/todos");
		} else {
			res.redirect("/todos");
		}
	});
});


//Runs on PORT localhost:27017
var PORT = process.env.PORT || 5000
app.listen(PORT, function(){
  console.log('Server Running');
});