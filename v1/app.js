const express 		= require("express");
const app 			= express();
const bodyParser 	= require("body-parser");
const mongoose		= require("mongoose");
const Campground	= require("./models/Campground");
const Comments		= require("./models/Comments");
const seeds			= require("./seeds");

//seeds();
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("/public"));

//====================================
//routes
//====================================

app.get("/", (req,res)=>{
	res.render("landing");
});

//INDEX - Show all Campground
app.get("/camps", (req,res)=>{
		
		Campground.find({}, (err, allCampgrounds)=>{
			if(err){
				console.log("Error!");
				console.log(err);
			}else{
				console.log("Campground Added!");
				res.render("campground/camps", {campgrounds: allCampgrounds});
			}
		});
	
		// res.render("camps", {campgrounds: campgrounds});
		
	});

//CREATE - create new campground
app.post("/camps", (req,res)=>{
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
app.get("/camps/new", (req,res)=>{
	res.render("campground/new");
});

//find the campground with given id and render that page
app.get("/camps/:id", (req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec((err, campDetails)=>{
		
		if(err){
			console.log(err);
		}else{
			console.log(campDetails);
			res.render("campground/show", {camp: campDetails});
		}
		
	});
	
});

//NEW comment
app.get("/camps/:id/comment/new", (req,res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if(err){
			console.log(err);
		}else{
			res.render("comment/new", {camp: campground})
		}
	});
});

//CREATE new comment
app.post("/camps/:id/comment", (req, res)=>{
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
					campground.comments.push(comment);
					campground.save();
					res.redirect("/camps/" + campground._id)
				}
			});
		}
	});
});


//listener
app.listen(3000, ()=>{
	console.log("The YelpCamp Server Has Started!");
})