var uuid = require("node-uuid");
var eventproxy = require("eventproxy");

var models = require("../models");
var articleModel = models.Article;
var userModel = models.User;
var navigationModel = models.Navigation;
var settingsModel = models.Settings;

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
    global : function (req, res, next) {
        var ep = eventproxy.create("nav", "sets", function (nav, sets) {
            res.locals.nav = nav;
            res.locals.sets = sets;
            next();
        });
        ep.fail(next);

        navigationModel.find().exec(ep.done("nav"));

        settingsModel.findOne().exec(ep.done("sets"))
    },
    home : function(req, res, next) {
        articleModel.find().exec(function(err, articles) {
            if(err){
                return next(err);
            }
            res.render("blog/home", {articles : articles});
        });
    },
    article : function(req, res, next) {
        var articleid = req.params.articleid;
        articleid = !articleid ? "" : articleid.replace(" ", "");
        if(articleid == ""){
            res.redirect("/");
        }else{
            articleModel.findOne({articleid : articleid}).exec(function(err, article) {
                if(err){
                    next(err);
                }else{
                    if(!article){
                        next();
                    }
                    userModel.findOne({uid : article.author}).exec(function (err, user) {
                        if(err){
                            return next(err);
                        }
                        if(!user){
                            return next();
                        }
                        res.render("blog/article", {article : article, author : user});
                    })
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
        }
    }
}
module.exports = blogController;