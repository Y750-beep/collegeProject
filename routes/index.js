

//***************************
//Auth Routes
//***************************

//show register form
var express = require("express");
var router  = express.Router();
var User    = require("../models/user");
var Blog = require("../models/blog.ejs");
var passport = require("passport");
var middleware = require("../middleware");
router.get("/register", function(req, res){
    res.render("register");
});
const { resolve } = require("path");


const stripe = require('stripe')('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');
//handle signIn logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    if(req.body.adminCode === 'secret_Code'){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);

             return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/blogs");
        });
           
        
    });
});
//show login form
router.get("/login", function(req, res){
    res.render("login");
});
//handling login logic
router.post("/login", passport.authenticate("local",{
    successRedirect: "/blogs",
    failureRedirect: "/login",
    failureFlash:  'Please Check Your Credentials',
    successFlash: 'Welcome to QuickWrite'
}), function(req, res){

});

//logout logic
router.get("/logout", function(req,  res){
    req.logout();
    req.flash("success", "Logged You Out");
    res.redirect("/blogs");
});

// USER PROFILE
router.get("/users/:id", function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if(err) {
      req.flash("error", "Something went wrong.");
      res.redirect("/");
    }
    Blog.find().where('author.id').equals(foundUser._id).exec(function(err, blogs) {
      if(err) {
        req.flash("error", "Something went wrong.");
        res.redirect("/");
      }
      res.render("users/show", {user: foundUser, blogs: blogs });
    })
  });
});

// // GET checkout
router.get('/checkout', middleware.isLoggedIn, (req, res) => {
   
    res.render('checkout.ejs', { amount: 100 });
});
const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 100;
};
router.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "inr"
  });
  res.send({
    clientSecret: paymentIntent.client_secret
  });
});
module.exports = router;