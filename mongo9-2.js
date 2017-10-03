//Fetching data from mongodb by ID

//Example 1:

//1) Start local server
//2) Go to postman
//3) Make a get request to localhost:27017/todos/anything_you_want
//4) res.send(req.params) = {"id": "anything_you_want"}
//5) res.send(req.params.id) = "anything_you_want"

//Example 2:

//1) Start local server
//2) Go to postman
//3) Make a get request to localhost:27017/todos/id from robomongo
//4) Returns the object with given id passed

//mongoose
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

app.get('todos/:id', (req, res) => {
	//req.params = { "_id": toyota }
	//req.params.id = toyota 
	//:id = req.params.id
	var id = req.params.id;
	
	//if the object ID is not valid, return an error
	if (!ObjectID.isValid(id)) {
		//.send() = empty body
		return console.log('none');
	}
	
	ToDo.findById(id).then((todo) => {
		if (!todo) {
			return console.log('no to do')
		}
			//this sends the data
			res.send({todo: todo});
	}).catch((error) => {
		console.log('none');
	});

});



var PORT = process.env.PORT || 27017

app.listen(PORT, function(){
  console.log('Server Running');
});