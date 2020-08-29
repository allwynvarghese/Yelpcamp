
const express = require("express");
const router = express.Router();
const Campground = require("../models/Campground");
const middleware = require("../middleware");


//====================================
//ROUTES
//====================================

//landing page
router.get("/", (req,res)=>{
	res.render("landing");
});

//INDEX - Show all Campground
router.get("/camps", (req,res)=>{
		
		Campground.find({}, (err, allCampgrounds)=>{
			if(err){
				console.log("Error!");
				console.log(err);
			}else{
				//console.log("Campground Added!");
				res.render("campground/camps", {campgrounds: allCampgrounds});
			}
		});
	});

//CREATE - create new campground
router.post("/camps", middleware.isLoggedIn, (req,res)=>{
	//get data from the form
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.desc;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	//array has object data
	var newCamps = {name: name, image: image, desc: desc, author: author};
	
	//push the above object to DB
	Campground.create(newCamps, (err, campground)=>{
		if(err){
			console.log(err);
		}else{
			//redirect to campgrounds page
			res.redirect("/camps");
		}
	});
	
});

//NEW - show form to create new campground
router.get("/camps/new", middleware.isLoggedIn, (req,res)=>{
	res.render("campground/new");
});

//find the campground with given id and render that page
router.get("/camps/:id",(req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec((err, campDetails)=>{
		
		if(err){
			console.log(err);
		}else{
			console.log(campDetails);
			res.render("campground/show", {camp: campDetails});
		}
		
	});
	
});

//Edit campground
router.get("/camps/:id/edit", middleware.checkAuthorization, (req, res)=>{
	Campground.findById(req.params.id, (err, foundCamp)=>{
		if(err){
			console.log(err);
			res.redirect("/camps/:id")
		}else{
			res.render("campground/edit", {camp: foundCamp});
		}
	});
	
});

router.put("/camps/:id", middleware.checkAuthorization, (req, res)=>{
	Campground.findByIdAndUpdate(req.params.id, req.body.camp, (err, updatedCamps)=>{
		if(err){
			res.redirect("/camps");
		}else{
			res.redirect("/camps/" + req.params.id);
		}
	});
});

//Destroy camps
router.delete("/camps/:id", middleware.checkAuthorization, (req, res)=>{
	Campground.findByIdAndRemove(req.params.id, (err)=>{
		if(err){
			console.log(err);
			res.redirect("/camps");
		}else{
			res.redirect("/camps");
		}
	});
});


module.exports = router;

