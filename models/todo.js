var mongoose = require('mongoose');

var ToDoSchema = new mongoose.Schema ({
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
		type: String,
		//cannot be blank. a value must exist
		required: true,
		//Must input at least 1 character in "text" below
		minlength: 1,
		//removes any white space like below
		trim: true
	},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId, //stores comment ID, not actual comment
			ref: "User" //name of Model
		},
		username: String
	}		
});

module.exports = mongoose.model("ToDo", ToDoSchema)


