const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/Campground");
const Comments = require("../models/Comments");
const middleware = require("../middleware");

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
					comment.author.id = req.user._id;
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

//Edit Comments
router.get("/camps/:id/comment/:comment_id/edit", middleware.checkCommentAuth, (req, res)=>{
	Campground.findById(req.params.id, (err, foundCamps)=>{
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			Comments.findById(req.params.comment_id, (err, foundComment)=>{
				res.render("comment/edit", {camp: foundCamps, comment: foundComment});
			});
		}
	});
	
});

//Add edited comments
router.put("/camps/:id/comment/:comment_id", (req, res)=>{
	Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, middleware.checkCommentAuth, (err, updatedComment)=>{
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			res.redirect("/camps/" + req.params.id);
		}
	});
});

//Destroy comments
router.delete("/camps/:id/comment/:comment_id", middleware.checkCommentAuth, (req,res)=>{
	Comments.findByIdAndRemove(req.params.comment_id, (err)=>{
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			res.redirect("/camps/" + req.params.id );
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