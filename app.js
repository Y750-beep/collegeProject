var bodyParser       = require("body-parser"),
    methodOverride   = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose         = require("mongoose"),
    express          = require("express"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    Blog             = require("./models/blog.ejs"),
    Comment          = require("./models/comment"),
    User             = require("./models/user"),
    flash            = require("connect-flash"),
    app              = express();



var commentRoute     = require("./routes/comments"),    
    blogRoute        = require("./routes/blog"),
    indexRoute       = require("./routes/index");    


mongoose.connect("mongodb://localhost:27017/blogapp-",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

//Passport Configuration
app.use(require("express-session")({
    secret:            "She again got the em brown eyes",
    resave:            false,
    saveUninitialized: false
}));

app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
});

app.get("/", function(req, res){
    res.render("landing");
});

   app.use(indexRoute);
   app.use(blogRoute);
   app.use(commentRoute);


var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("Server has been started");
});    






