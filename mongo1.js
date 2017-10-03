var express = require('express')
var app = express();

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//Object destructuring (pulling out properties)
var user = {name: 'Stebs', location: 'Bay Area' };
//take property you want to remove and set it equal to the object name
var {name, location} = user;
//Displays: "Stebs", "Bay Area"
console.log(name, location);

//const MongoClient = require('mongodb').MongoClient; 
//or
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


//This creates a new object in the collection called "Todos"
	//"_id" can be overwritten if you write it as a new property 
	db.collection('Users').insertOne({
		name: 'Steven',
		location: 'Bay Area'
	}, (err, result) => {
		if (err) {
			return console.log('Unable to insert new data', err);
		}
			//result.ops displays:
			//[
			// {
			//	"name": "Steven",
			//	"location": "Bay Area",
			//	"_id": "4923745jlsdfjldj239"
			// }
			//]
			console.log(JSON.stringify(result.ops, undefined, 2));
	});

	//this will close mongodb
	//db.close();



});




//Runs on PORT localhost:7000
var PORT = process.env.PORT || 27017

app.listen(PORT, function(){
  console.log('Server Running');
});