var mongoose = require('mongoose');

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

module.exports = {
	User: User
}