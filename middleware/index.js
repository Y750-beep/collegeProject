//all middle ware goes here

var middlewareObj = {};
var Blog = require("../models/blog.ejs");
var Comment    = require("../models/comment");
middlewareObj.checkBlogOwnership = function (req, res, next){
    if(req.isAuthenticated()){
       Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            req.flash("error", "Something went wrong! Please check your Credentials");
            res.redirect("back");
        }
        else{
            //does user own the blog?
            if(foundBlog.author.id.equals(req.user._id) || req.user.isAdmin){
            next();  
            } 
            else{
                res.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
            }
        });
            
        }
        else{
            res.redirect("back")
        }
}

middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
       Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }
        else{
            //does user own the comment?
            if(foundComment.author.id.equals(req.user._id)  || req.user.isAdmin){
            next();  
            } 
            else{
                    req.flash("error", "Access Denied! LogIn first");

                res.redirect("back");
            }
            }
        });
            
        }
        else{
                req.flash("error", "You need to logIn to do that!");

            res.redirect("back")
        }
}
middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to logIn to do that!");
    res.redirect("/login");
}




module.exports  = middlewareObj;