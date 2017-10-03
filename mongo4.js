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

	//search for ID of the object
	db.collection('Users').findOneAndUpdate({_id: new ObjectID('59d00e99ea94b25a9f09e485')
	}, {
		//This updates the name property
		$set: {
			name: 'Andrew'
		},
		//This increments the age property by 1
		//$inc: {
		//	age:1
		//}
	}, {	
		//"false" will update the object
		returnOriginal: false
	}).then((result) => {
		//displays the updated object
		console.log(result);
	});	

});


//Runs on PORT localhost:7000
var PORT = process.env.PORT || 27017

app.listen(PORT, function(){
  console.log('Server Running');
});