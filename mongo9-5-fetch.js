//Posting all data found in mongoDB

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

//Fetching the data
//Go to postman and use "GET". Type url as localhost:27017/todos 
app.get('/todos', (req,res) => {
	ToDo.find().then((todos) => {
		//displays all todos in postman
		res.render("practice.ejs", {todos: todos});
	}, (error) => {
		res.send(error);
	})
});

var PORT = process.env.PORT || 5000

app.listen(PORT, function(){
  console.log('Server Running');
});