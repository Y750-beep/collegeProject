//INDEX - show all campgrounds
var express = require("express");
var router  = express.Router();
var middleware = require("../middleware");

var Blog = require("../models/blog.ejs");
var Comment    = require("../models/comment");


router.get("/blogs", function(req, res){
    console.log(req.user);
    // Get all campgrounds from DB
    Blog.find({}, function(err, allBlogs){
       if(err){
           console.log(err);
       } else {
          res.render("blogs/index",{blogs:allBlogs, currentUser: req.user});
       }
    });
});
router.get("/blogs/technology", function(req, res){
    console.log(req.user);
    // Get all campgrounds from DB
    Blog.find({}, function(err, allBlogs){
       if(err){
           console.log(err);
       } else {
          res.render("blogs/blogPages",{blogs:allBlogs, currentUser: req.user});
       }
    });
});

//CREATE - add new campground to DB
router.post("/blogs", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newBlog = {name: name, image: image, description: desc, author: author}
    // Create a new campground and save to DB
    
    Blog.create(newBlog, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/blogs");
        }
    });
});

//CREATE - add new campground to DB
router.post("/blogs/technology", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var cat = req.body.category;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newBlog = {name: name, image: image, description: desc, category: cat, author: author}
    // Create a new campground and save to DB
    
    Blog.create(newBlog, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/blogs/technology");
        }
    });
});


//NEW - show form to create new campground
router.get("/blogs/new", middleware.isLoggedIn, function(req, res){
   res.render("blogs/new.ejs"); 
});
//category page
router.get("/blogs/technology", function(req, res){
    res.render("blogs/blogPages.ejs");
});
// SHOW - shows more info about one campground
router.get("/blogs/:id", function(req, res){
    //find the campground with provided ID
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("blogs/show", {blog: foundBlog});
        }
    });
});





//EDIT route
router.get("/blogs/:id/edit", middleware.checkBlogOwnership, function(req,res){
       Blog.findById(req.params.id, function(err, foundBlog){
            res.render("blogs/edit", { blog: foundBlog});   
        });
            });

//update router
router.put("/blogs/:id",middleware.checkBlogOwnership, function(req, res){
    //find and update the correct blog
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, UpdatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//Delete Route
router.delete("/blogs/:id",middleware.checkBlogOwnership, function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
                req.flash("Success", "Success!");

            res.redirect("/blogs");
        }
    });
});


//Edit Comment
router.get("/blogs/:id/comments/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
        res.redirect("back");
    }
    else{
        res.render("comments/edit", { blog_id: req.params.id, comment: foundComment});
    }
   });
});

//update comment
router.put("/blogs/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/blogs/"+ req.params.id);
        }
    });
});
//delete comment
router.delete("/blogs/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req, res){
    //find and remove 
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }
        else{
                req.flash("success", "Success!");

            res.redirect("/blogs/" + req.params.id);
        }
    });
});

module.exports = router;