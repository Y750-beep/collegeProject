// ****************************************
//Comment Routes
var express = require("express");
var router  = express.Router();
var middleware = require("../middleware");

var Blog = require("../models/blog.ejs");
var Comment    = require("../models/comment");

router.get("/blogs/:id/comments/new", middleware.isLoggedIn, function(req, res){
    //find campground by id
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {blog: blog});
        }
    })
});

router.post("/blogs/:id/comments", middleware.isLoggedIn,  function(req, res){
    //lookup blog id
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }
                else{
                    //ad username
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                   

                    //save comment
                    comment.save();
                    blog.comments.push(comment);
            blog.save();
            res.redirect("/blogs/"+ blog._id);
                }
            });
            
        }
    });
});


module.exports = router;
