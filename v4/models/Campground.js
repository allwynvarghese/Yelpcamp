const mongoose = require("mongoose");

//Campground Schema Setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	desc: String,
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectID,
			ref: "Users"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
 
});

module.exports = mongoose.model("Campground", campgroundSchema);