const express = require("express");
const router = express.Router();
const Users = require("../models/Users");
const passport	= require("passport");

//====================================
//Auth Register Routes
//====================================

router.get("/register", (req, res)=>{
	res.render("auth/register");
});

router.post("/register", (req,res)=>{
	var newUser = new Users({username: req.body.username})
	Users.register(newUser, req.body.password, (err, user)=>{
		if(err){
			console.log(err);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, ()=>{
			res.redirect("/camps");
		});
	});
});

//====================================
//Auth Login Routes
//====================================

router.get("/login", (req, res)=>{
	res.render("auth/login",  {message: req.flash("error")});
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/camps",
	failureRedirect: "/login"
}), (req, res)=>{});

//auth session checker middleware function
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

//====================================
//Auth Logout Routes
//====================================

router.get("/logout", (req,res)=>{
	req.logout();
	res.redirect("/login");
});

module.exports =router;