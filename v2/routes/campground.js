
const express = require("express");
const router = express.Router();
const Campground = require("../models/Campground");


//====================================
//ROUTES
//====================================

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
router.post("/camps", isLoggedIn, (req,res)=>{
	//get data from the form
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.desc;
	
	//array has object data
	var newCamps = {name: name, image: image, desc: desc};
	
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
router.get("/camps/new", isLoggedIn, (req,res)=>{
	res.render("campground/new");
});

//find the campground with given id and render that page
router.get("/camps/:id", (req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec((err, campDetails)=>{
		
		if(err){
			console.log(err);
		}else{
			console.log(campDetails);
			res.render("campground/show", {camp: campDetails});
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

