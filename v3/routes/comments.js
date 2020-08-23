const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/Campground");
const Comments = require("../models/Comments");

//NEW comment
router.get("/camps/:id/comment/new", isLoggedIn, (req,res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if(err){
			console.log(err);
		}else{
			res.render("comment/new", {camp: campground})
		}
	});
});

//CREATE new comment
router.post("/camps/:id/comment", isLoggedIn, (req, res)=>{
	//1. find campground by id
	Campground.findById(req.params.id, (err, campground)=>{
		if(err){
			console.log("err");
		}else{
			//2. Create the comment
			Comments.create(req.body.comment, (err, comment)=>{
				if(err){
					console.log(err);
				}else{
					//add user to comments
					comment.author._id = req.user._id;
					comment.author.username = req.user.username;
					//save the comments
					comment.save();
					//push comment into campground
					campground.comments.push(comment);
					campground.save();
					res.redirect("/camps/" + campground._id)
				}
			});
		}
	});
});

//auth session checker middleware function
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


module.exports = router;