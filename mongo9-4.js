//Updating data from mongoDB

//Go to postman and use "PATCH". Type url as localhost:7000/todos/copy a paste _id here
//Go to body tab > raw > JSON (applicaton/json)
//If you type: { "completed" : true, "text": 'This is updated }

//mongoose
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


app.patch('/todos/:id', (req, res) => {
	var id = req.params.id
	//only updates properties with text and name
	var body = _.pick(req.body, ['text', 'name']);
	console.log(req.body.name)

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
		res.send({todo: todo});	
		res.send(req.body)
	}).catch((error) => {
		res.status(400).send();
	});

});


var PORT = process.env.PORT || 27017

app.listen(PORT, function(){
  console.log('Server Running');
});