const express 					= require("express");
const app 						= express();
const bodyParser 				= require("body-parser");
const mongoose					= require("mongoose");
const passport					= require("passport");
const LocalStrategy				= require("passport-local");
const passportLocalMongoose		= require("passport-local-mongoose");
const Campground				= require("./models/Campground");
const Comments					= require("./models/Comments");
const Users						= require("./models/Users");
const seeds						= require("./seeds");

const campRoutes	=	require("./routes/campground"),
	  commentRoutes	=	require("./routes/comments"),
	  indexRoutes	=	require("./routes/index");

//seeds(); //seed the DB

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("/public"));


//====================================
//Passport Configuration
//====================================
app.use(require("express-session")({
	secret: "momoth",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

//Current User middleware
app.use((req, res, next)=>{
	res.locals.currentUser = req.user;
	next();
});

app.use(indexRoutes);
app.use(campRoutes);
app.use(commentRoutes);


//====================(================
//LISTENER
//====================================
app.listen(3000, ()=>{
	console.log("The YelpCamp Server Has Started!");
});