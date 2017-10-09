//mongoose.js
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//this creates the mongoDB database
mongoose.connect("mongodb://localhost/loginapp", {useMongoClient: true});

module.exports = {
	mongoose: mongoose
}