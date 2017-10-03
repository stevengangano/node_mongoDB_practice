var mongoose = require('mongoose');

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
		type: String,
		//cannot be blank. a value must exist
		required: true,
		//Must input at least 1 character in "text" below
		minlength: 1,
		//removes any white space like below
		trim: true
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

module.exports = {
	ToDo: ToDo
}