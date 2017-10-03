//Finding data in mongoDB

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


//.find({}): returns an array
//Displays all objects with the _id: '24jsdlfj23497sdfhlsdjf'
ToDo.find({
	_id: "59d1413dfc1da8a75d6db76d"
}).then((todos) => {
	console.log(todos);
});

//.findOne({}): returns an object - recommended
//Displays only one object with the _id: '24jsdlfj23497sdfhlsdjf'
ToDo.findOne({
	_id: "59d1413dfc1da8a75d6db76d"
}).then((todo) => {
	console.log(todo);
});

//Searching an object ID
//Returns an object - recommended
//Displays only one object with the _id: '24jsdlfj23497sdfhlsdjf'
ToDo.findById("59d1413dfc1da8a75d6db76d").then((todo) => {
	//if ID does not exist
	if (!todo) {
		return console.log('ID not found');
	}
	console.log(todo);
})



//Alternate way to check if the ID exists
if (!ObjectID.isValid("59d1413dfc1da8a75d6db76d")) {
	console.log('ID not valid');
}














var PORT = process.env.PORT || 27017

app.listen(PORT, function(){
  console.log('Server Running');
});