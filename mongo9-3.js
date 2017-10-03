//Deleting data from mongoDB

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


//Example 1:
ToDoProp.findOneandRemove({}).then((result) => {
	console.log(result)
});

//Example 2:
ToDoProp.remove({}).then((result) => {
	console.log(result)
});
//Example 3:
ToDo.findByIdAndRemove('59d1413dfc1da8a75d6db76d').then((todo) => {
	console.log(todo)
});


var PORT = process.env.PORT || 27017

app.listen(PORT, function(){
  console.log('Server Running');
});