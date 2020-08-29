const express 					= require("express");
const app 						= express();
const bodyParser 				= require("body-parser");
const mongoose					= require("mongoose");
const passport					= require("passport");
const LocalStrategy				= require("passport-local");
const passportLocalMongoose		= require("passport-local-mongoose");
const methodOverride			= require("method-override");
const Campground				= require("./models/Campground");
const Comments					= require("./models/Comments");
const Users						= require("./models/Users");
const seeds						= require("./seeds");
const flash						= require("connect-flash");
const exit						= require("exit-hook");
const campRoutes				= require("./routes/campground"),
	  commentRoutes				= require("./routes/comments"),
	  indexRoutes				= require("./routes/index");

//seeds(); //seed the DB

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static((__dirname, 'public')));
app.use(methodOverride("_method"));
app.use(flash());

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
app.use(flash());
passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

//Current User middleware
app.use((req, res, next)=>{
	res.locals.currentUser = req.user;
	res.locals.message = req.flash("error");
	next();
});

app.use(indexRoutes);
app.use(campRoutes);
app.use(commentRoutes);

exit(() => {
	
    console.log('Exiting');
});


//====================(================
//LISTENER
//====================================
app.listen(3000, ()=>{
	console.log("The YelpCamp Server Has Started!");
});