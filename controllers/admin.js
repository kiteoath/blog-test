var uuid = require("node-uuid");
var jwt = require("jsonwebtoken");
var validator = require("validator");
var bcryptjs = require("bcryptjs");
var eventproxy = require("eventproxy");

var models = require("../models");
var articleModel = models.Article;
var userModel = models.User;
var settingsModel = models.Settings;
var navigationModel = models.Navigation;

var adminController = {
    checkLogin : function(req, res, next) {
        var token = req.cookies["access-token"];
        var ep = eventproxy.create("user", "settings", function (user, settings) {
            res.locals.user = user;
            res.locals.settings = settings;
            return next();
        });
        ep.fail(function (err) {
            if(err.action){
                res.redirect("/admin/login");
            }else{
                next(err);
            }
        })
        jwt.verify(token, "d3d3LnpqZ3QuY29t", function(err, decode) {
            if(err){
                err.action = "login";
                ep.throw(err);
            }else{
                userModel.findOne({uid : decode.uid}, ep.done("user"));
            }
        });
        settingsModel.findOne().exec(ep.done("settings"));
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
        var articleid = req.params.articleid;
        articleid = !articleid ? "" : validator.trim(articleid);

        if(articleid == ""){
            var article = new articleModel({
                articleid : uuid.v4(),
                title : validator.trim(req.body.title),
                background : req.body.background,
                brief : req.body.brief,
                content : req.body.content,
                feature : req.body.feature,
                recommend : req.body.recommend,
                status : req.body.status,
                author : res.locals.user.uid,
            });
            article.save(function (err) {
                if(err){
                    return next(err);
                }
                res.redirect("/admin/article/list");
            });
        }else {
            articleModel.findOne({articleid: articleid}).exec(function (err, article) {
                if (err) {
                    return next(err)
                }
                if (!article) {
                    return res.redirect("/admin/article/list");
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
                    if (err) {
                        return next(err);
                    }
                    res.redirect("/admin/article/list");
                })
            })
        }
    },
    showTeamCreate : function (req, res, next) {
        var uid = req.params.uid;

        if(!uid){
            res.render("admin/teamEdit", {useredit : {}});
        }else{
            userModel.findOne({uid : uid}).exec(function (err, user) {
                if(err){
                    return next(err);
                }
                if(!user){
                    return res.redirect("/admin/team/list");
                }
                res.render("admin/teamEdit", {useredit : user});
            });
        }

    },
    saveTeamUser : function (req, res, next) {
        var uid = req.params.uid;
        uid = !uid ? "" : uid;

        if(uid == ""){
            var user = new userModel({
                uid : uuid.v4(),
                username : req.body.username,
                userpwd : req.body.userpwd,
                nickname : req.body.nickname,
                brief : req.body.brief,
                cover : req.body.cover,
                avator : req.body.avator
            });
            user.save(function (err) {
                if(err){
                    return next(err);
                }
                res.redirect("/admin/team/list");
            })
        }else{
            userModel.findOne({uid : uid}).exec(function (err, user) {
                if(err){
                    return next(err);
                }
                if(!user){
                    return res.redirect("/admin/team/list");
                }
                user.username = req.body.username;
                user.nickname = req.body.nickname;
                user.brief = req.body.brief;
                user.cover = req.body.cover;
                user.avator = req.body.avator;
                user.save(function (err) {
                    if(err){
                        return next(err);
                    }
                    res.redirect("/admin/team/list");
                })
            })
        }
    },
    showTeamList : function (req, res, next) {
        userModel.find().exec(function (err, users) {
            if(err){
                return next(err);
            }
            res.render("admin/teamList", { users : users});
        })
    },
    showSettingsGeneral : function (req, res, next) {
        settingsModel.findOne().exec(function (err, settings) {
            res.render("admin/settingsGeneral", {settings : settings});
        })
    },
    settingsGeneral : function (req, res, next) {
        settingsModel.findOne().exec(function (err, settings) {
            if(err){
                return next(err)
            }
            if(!settings){
                settings = new settingsModel();
            }
            settings.name = req.body.name;
            settings.brief = req.body.brief;
            settings.logo = req.body.logo;
            settings.background = req.body.background;
            settings.page = req.body.page;
            settings.save(function (err) {
                if(err){
                    return next(err);
                }
                res.redirect("/admin/settings/general");
            })
        })
    },
    showNavigation : function (req, res, next) {
        navigationModel.find().exec(function (err, navigation) {
            if(err){
                return next(err);
            }
            res.render("admin/navigation", {navigation : navigation});
        });
    },
    saveNavigation : function (req, res, next) {
        var action = req.query.action;
        switch(action){
            case "new":
                var id = uuid.v4();
                var nav = new navigationModel({
                    id : id,
                    name : req.body.name,
                    url : req.body.url
                });
                nav.save(function (err) {
                    if(err){
                        return res.json({
                            status : 1,
                            msg : "添加失败",
                            err : err
                        });
                    }
                    return res.json({
                        status : 0,
                        msg : "添加成功",
                        id : id
                    });
                })
                break;
            case "modify":
                navigationModel.findOne({id : req.body.id}).exec(function (err, nav) {
                    if(err){
                        return res.json({
                            status : 1,
                            msg : "修改失败",
                            err : err
                        });
                    }
                    if(!nav){
                        return res.json({
                            status : 2,
                            msg : "查无数据"
                        });
                    }
                    nav.name = req.body.name;
                    nav.url = req.body.url;
                    nav.save(function (err) {
                        if(err){
                            return res.json({
                                status : 1,
                                msg : "修改失败",
                                err : err
                            });
                        }
                        return res.json({
                            status : 0,
                            msg : "修改成功"
                        });
                    })
                })
                break;
            case "del":
                navigationModel.remove({id : req.body.id}).exec(function (err) {
                    if(err){
                        return res.json({
                            status : 1,
                            msg : "删除失败",
                            err : err
                        });
                    }
                    return res.json({
                        status : 0,
                        msg : "删除成功"
                    });
                })
        }
    },
    showCodeInjection : function (req, res, next) {
        settingsModel.findOne().exec(function (err, settings) {
            if(err){
                return next(err)
            }
            res.render("admin/codeinjection", {code_head : settings.code_head, code_foot : settings.code_foot});
        })
    },
    saveCodeInjection : function (req, res, next) {
        settingsModel.findOne().exec(function (err, settings) {
            if(err){
                return next(err)
            }
            settings.code_head = req.body.code_head;
            settings.code_foot = req.body.code_foot;

            settings.save(function (err) {
                if(err){
                    return next(err);
                }
                res.redirect("/admin/settings/code-injection");
            })
        })
    },
    showModifypwd : function (req, res, next) {
        res.render("admin/modifypwd", {});
    },
    saveModifypwd : function (req, res, next) {
        var ep = new eventproxy();
        ep.on("error", function (msg) {
            return res.render("admin/modifypwd", {msg : msg});
        });

        if([req.body.userpwd, req.body.usernewpwd, req.body.usernewpwdcheck].some(function(item){return !item || item == ""})){
            return ep.emit("error", "信息不完整" );
        }

        if(!bcryptjs.compareSync(req.body.userpwd, res.locals.user.userpwd)){
            return ep.emit("error", "密码不正确" );
        }

        userModel.findOne({uid : res.locals.user.uid}).exec(function (err, user) {
            if(err){
                return next(err);
            }
            user.userpwd = bcryptjs.hashSync(req.body.usernewpwd, 10);
            user.save(function (err) {
                if(err){
                    return ep.emit("error", "保存失败");
                }
                return ep.emit("error", "保存成功");
            })
        })
    }

}

module.exports = adminController;
