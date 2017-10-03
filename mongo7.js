//POSTING DATA

//mongoose
var {mongoose} = require('./db/mongoose.js')
//Models
var {ToDo} = require('./models/todo.js');
var {User} = require('./models/user.js');


var express = require('express')
var app = express();
//takes JSON and turns it into an object
var bodyParser = require('body-parser');
app.use(bodyParser.json());

//Disconnect from Robomongo
//Go to postman and use "POST". Type url as localhost:27017/todos
//Go to body tab > raw > JSON (applicaton/json)
//If you type JSON data into the body in postman, it will display in console  
//For example: { "text" : "This is from postman" }
//Go back to Robomongo. Data is in todos collection
                                                                                                                                        
app.post('/todos', (req, res) => {
	
	//Create a variable for the data
	//This displays whatever is posted from postman
	//For example: { "text" : "This is from postman" }
	//Check robomongo to see if object was posted to the collection
	//console.log(req.body) = { "text" : "This is from postman" }
	var todo = new ToDo ({
		//This grabs the text property value
		text: req.body.text,
		name: req.body.name
	});

	//Saves the above to the database
	todo.save().then((data) => {	
		res.send(data);
		console.log(data)
	}, (error) => {	
		//httpstatuses.com
		res.send(error);
	});
});


//Runs on PORT localhost:27017
var PORT = process.env.PORT || 27017

app.listen(PORT, function(){
  console.log('Server Running');
});