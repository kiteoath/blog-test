var uuid = require("node-uuid");

var models = require("../models");
var articleModel = models.Article;
var userModel = models.User;

var authorGetUser = function(authorid) {
    return new Promise(function(resolve, reject) {
        userModel.findOne({uid : authorid}).exec(function(err, author) {
            if(err){
                reject(err);
            }else{
                resolve(author);
            }
        });
    })
}

var authorGetArticle = function(author) {
        return new Promise(function(resolve, reject) {
            articleModel.find({author : author.uid}).exec(function(err, articles) {
                if(err){
                    reject(err);
                }else{
                    resolve({author : author, articles : articles});
                }
            });
        })
    }


var blogController = {
    home : function(req, res, next) {
        articleModel.find().populate("author").exec(function(err, articles) {
            if(err){
                return next(err);
            }
            res.render("blog/home", {articles : articles});
        });
    },
    article : function(req, res, next) {
        var articleid = req.params.articleid;
        if(!articleid){
            res.redirect("/");
        }else{
            articleModel.findOne({articleid : articleid}).populate("author").exec(function(err, article) {
                if(err){
                    next(err);
                }else{
                    if(!article){
                        next();
                    }
                    res.render("blog/article", {article : article});
                }
            });
        }
    },
    author : function(req, res, next) {
        var authorid = req.params.authorid;
        if(!authorid){
            res.redirect("/");
        }else{

            authorGetUser(authorid)
                .then(authorGetArticle)
                .then(function(data, test) {
                    //console.log(data, test);
                    res.render("blog/author", data);
                })
                .catch(function(err) {
                    next(err);
                });
                console.log("1111111111");
        }
    }
}
module.exports = blogController;