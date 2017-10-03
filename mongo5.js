var express = require('express')
var app = express();
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {MongoClient, ObjectID } = require('mongodb');

//this creates the mongoDB database
mongoose.connect("mongodb://localhost/toDoApp");

//ToDo is the collection name

//Step 1: Create a model
var ToDo = mongoose.model ('ToDo', {
	text: {
		type: String,
		//cannot be blank. a value must exist
		required: true,
		//Must input at least 1 character in "text" below
		minlength: 1,
		//removes any white space like below
		trim: true
	},
	name: {
		type: String
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number,	
		default: null
	}
});

//Step 2: Create a variable

var otherTodo = new ToDo ({
	text: '    Feed the cat',
	name: 'Rae',
	completed: true,
	completedAt: 123
});

//Step 3: Save the variable to the database
otherTodo.save().then((doc) => {
	console.log(JSON.stringify(doc, undefined, 2));
	}, (error) => {
		console.log('Unable to save', error);
});




//Runs on PORT localhost:27017
var PORT = process.env.PORT || 27017

app.listen(PORT, function(){
  console.log('Server Running');
});