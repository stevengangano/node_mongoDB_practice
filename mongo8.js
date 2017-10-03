//Getting Data

//mongoose
var {mongoose} = require('./db/mongoose.js')
//Models
var {ToDo} = require('./models/todo.js');
var {User} = require('./models/user.js');


var express = require('express')
var app = express();
//takes JSON and turns it into an object
var bodyParser = require('body-parser');
app.use(bodyParser.json());

//Fetching the data
//Go to postman and use "GET". Type url as localhost:7000/todos 
app.get('/todos', (req,res) => {
	ToDo.find().then((todos) => {
		//displays all todos in postman
		res.send({todos});
	}, (error) => {
		res.send(error);
	})
});

var PORT = process.env.PORT || 27017

app.listen(PORT, function(){
  console.log('Server Running');
});