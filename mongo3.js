var express = require('express')
var app = express();
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {MongoClient, ObjectID } = require('mongodb');


//connecting webserver to the database
//toDoApp is the name of the database
MongoClient.connect('mongodb://localhost:27017/toDoApp', (err, db)  => {
	if(err) {
		//using return stops from continuing
		return console.log('Unable to connect to mongoDB server');
	}
		console.log('Connected to mongoDB server');


	//deleteMany({}) - deletes more than one. Deletes anything with a name, Andrew.
	db.collection('Users').deleteMany({location: 'Bay Area'});

	//findOneandDelete({}) - deletes one. This searches for the ID and deletes this object.
	//This is the best because it displays the object being deleted in the console
	db.collection('Users').findOneAndDelete({_id: new ObjectID('59d00f3db8eac65aa54e6e10')
	}).then((results) => {
		console.log(JSON.stringify(results, undefined, 2));
	});
})


//Runs on PORT localhost:7000
var PORT = process.env.PORT || 27017

app.listen(PORT, function(){
  console.log('Server Running');
});