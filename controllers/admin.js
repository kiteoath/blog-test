var uuid = require("node-uuid");
var jwt = require("jsonwebtoken");
var validator = require("validator");
var bcryptjs = require("bcryptjs");

var models = require("../models");
var articleModel = models.Article;
var userModel = models.User;

var adminController = {
    checkLogin : function(req, res, next) {
        var token = req.cookies["access-token"];
        jwt.verify(token, "d3d3LnpqZ3QuY29t", function(err, decode) {
            if(err){
                res.redirect("/admin/login");
            }else{
                userModel.findOne({uid : decode.uid}, function(err, user){
                    if(err){
                        return next(err);
                    }else{
                        res.locals.user = user;
                        return next();
                    }
                })
            }
        })
    },
    showLogin : function(req, res, next) {
        res.render("admin/login", {});
    },
    login : function(req, res, next) {
		var username = validator.trim(req.body.username);
		var userpwd = validator.trim(req.body.userpwd);

        if ([username, userpwd].some(function (item) { return !item || item === ""; })) {
			res.render("admin/login", {msg : "用户名密码输入不完整"});
		}

		userModel.findOne({ username : username }, function (err, user) {
			if (err) {
				return next(err);
			}
			if (!user) {
				return res.render("admin/login", { msg : "用户名不存在" });
			}
            if(!bcryptjs.compareSync(userpwd, user.userpwd)){
                return res.render("admin/login", { msg : "密码不正确" });
            }
			
            var token  = jwt.sign({uid : user.uid}, "d3d3LnpqZ3QuY29t", {expiresIn : "2 days"});
            res.cookie("access-token", token, {httpOnly : true});
            res.redirect("/admin");
		});
    },
    showReg : function(req, res, next) {
        res.render("admin/login", {});
    },
    register : function(req, res, next) {

    },
    logout : function(req, res, next) {
        res.clearCookie("access-token");
        res.redirect("/admin");
    },

    showArticleList : function(req, res, next) {
        articleModel.find().exec(function(err, articles){
            if(err){
                return next();
            }
            res.render("admin/articleList", {articles : articles});
        });
        
    },
    showArticle : function(req, res, next) {
        var articleid = req.params.articleid;
        if(articleid && articleid.length !== 0){
            articleModel.findOne({articleid : articleid}).exec(function(err, article){
                if(err){
                    return next(err);
                }
                if(!article){
                    article = {};
                }

                res.render("admin/articleEdit", {article : article});
            });
        }else{
            res.render("admin/articleEdit", {article : {}});
        }
    },
    saveArticle : function (req, res, next) {
        var articleid = validator.trim(req.params.articleid);
        if(!articleid || articleid == ""){
            return res.redirect("/admin/article/list");
        }
        articleModel.findOne({articleid : articleid}).exec(function (err, article) {
            if(err){
                return next(err)
            }
            article.title = validator.trim(req.body.title);
            article.background = req.body.background;
            article.brief = req.body.brief;
            article.content = req.body.content;
            article.feature = req.body.feature;
            article.recommend = req.body.recommend;
            article.status = req.body.status;

            article.update_at = Date.now();

            article.save(function (err) {
                if(err){
                    return next(err);
                }
                res.redirect("/admin/article/list");
            })
        })
    }
}

module.exports = adminController;
