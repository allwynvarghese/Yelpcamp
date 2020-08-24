const middlewareObj = {};
const Campground = require("../models/Campground");
const Comments = require("../models/Comments");

//auth session checker middleware function
middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		res.redirect("/login");
	};

//middleware to check user authorization
middlewareObj.checkAuthorization = function checkAuthorization(req, res, next){
	
	//check if the user is logged login
	if(req.isAuthenticated()){
		
		//check if the logged in user is the user who has created the camps.
		Campground.findById(req.params.id, (err, foundCamp)=>{
			
			if(err){
		   		console.log(err);
		   }else if(foundCamp.author.id.equals(req.user._id)){
				next();
		   }else{
			   res.redirect("back");
			   console.log("You are not authorized to perform this function");
		   }
			
		});
		
	}else{
		req.flash("error", "Please Login First!");
		res.redirect("/login");
		console.log("You will have to login!");
	}
}

//middle ware to check user Authorization for comment edit and delete
middlewareObj.checkCommentAuth = function checkCommentAuth(req, res, next){
	//check if the user is logged login
	if(req.isAuthenticated()){
		
		//check if the logged in user is the user who has created the camps.
		Comments.findById(req.params.comment_id, (err, foundComment)=>{
			console.log(foundComment.author.id);
			//console.log(req.user._id);
			if(err){
		   		console.log(err);
		   	}else if(foundComment.author.id.equals(req.user._id)){
				next();
		   	}else{
			   res.redirect("back");
			   console.log("You are not authorized to perform this function");
		   	}
			
		});
		
	}else{
		res.redirect("/login");
		console.log("You will have to login!");
	}
}

module.exports = middlewareObj;