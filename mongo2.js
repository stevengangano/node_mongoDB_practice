var express = require('express')
var app = express();
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {MongoClient, ObjectID } = require('mongodb');

//This creates a random object ID
var obj = new ObjectID();
console.log(obj);

//connecting webserver to the database
//toDoApp is the name of the database
//Promise must be when connecting to database
MongoClient.connect('mongodb://localhost:27017/toDoApp', (err, db) => {
	if(err) {
		//using return stops from continuing
		return console.log('Unable to connect to mongoDB server', err);
	}
		console.log('Connected to mongoDB server');

	//NOTE: You can alter the data or add new data in Robomongo
	//Looking for a collection with a certain object ID
	//find({}) shows all data in that collection
	//toArray() wraps it an array
	//count() counts the number of objects
	//Displays:
		//[
		//	{
		//		"_id": "3947jvlsjf"
		//		"text": "Something here"
		//		"completed": "true"
		//	}
		//]

	db.collection('Users').find({_id: new ObjectID('59d00eda9153ad5aa03942a7')}).toArray().then((data) => {
		console.log(data);
	});


});



//Runs on PORT localhost:7000
var PORT = process.env.PORT || 27017

app.listen(PORT, function(){
  console.log('Server Running');
});