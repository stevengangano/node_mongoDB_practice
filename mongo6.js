var express = require('express')
var app = express();
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {MongoClient, ObjectID } = require('mongodb');

//this creates the mongoDB database
mongoose.connect("mongodb://localhost/loginapp");

var User = mongoose.model ('User', {
	email: {
		type: String,
		required: true,
		//Must input 1 character
		minlength: 1,
		//removes any white space like below
		trim: true
	}
});

//Step 2: Create a variable
var newUser = new User ({
	email: '    stevengangano@yahoo.com',
});

//Step 3: Save the variable to the database

newUser.save().then((doc) => {
	console.log(JSON.stringify(doc, undefined, 2));
	}, (error) => {
		console.log('Unable to save', error);
});

//Runs on PORT localhost:27017
var PORT = process.env.PORT || 27017

app.listen(PORT, function(){
  console.log('Server Running');
});
