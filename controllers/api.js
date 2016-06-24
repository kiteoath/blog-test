var uuid = require("node-uuid");
var jwt = require("jsonwebtoken");
var validator = require("validator");
var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
var ueditor = require("ueditor");
var multer = require("multer");
var path = require("path");

var models = require("../models");
var userModel = models.User;
var articleModel = models.Article;



var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, path.join(__dirname, '../public/upload/image'));
    },
    filename: function (request, file, callback) {
        console.log(file);
        var filename = uuid.v4() + path.extname(file.originalname);
        callback(null, filename);
    }
});

var upload = multer({storage: storage}).any();

var apiController = {
    upload : function (request, response, next) {
        upload(request, response, function(err) {
            if(err) {
                console.log('Error Occured');
                return response.json({
                    success : 0,
                    message : "Error Occured"
                });
            }
            console.log(request.files[0]);
            return response.json({
                success : 1,
                message : "提示的信息，上传成功或上传失败及错误信息等。",
                url     : "/public/upload/image/" + request.files[0].filename        // 上传成功时才返回
            })
        })
    },
    ueditor : function (path) {
        return ueditor(path, function(req, res, next) {

            // ueditor 客户发起上传图片请求
            switch (req.query.action) {
                case "config":
                    res.setHeader('Content-Type', 'application/json');
                    // 这里填写 ueditor.config.json 这个文件的路径
                    res.redirect('/public/js/ueditor/config.json');
                    break;
                case "uploadimage":
                case "uploadscrawl":
                case "catchimage":
                    var dir_url = '/public/upload/image';
                    res.ue_up(dir_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
                    break;
                case "uploadvideo":
                    var dir_url = '/public/upload/video';
                    res.ue_up(dir_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
                    break;
                case "uploadfile":
                    var dir_url = '/public/upload/file';
                    res.ue_up(dir_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
                    break;
                case "listimage":
                    var dir_url = '/public/upload/image'; // 要展示给客户端的文件夹路径
                    res.ue_list(dir_url) // 客户端会列出 dir_url 目录下的所有图片
                    break;
                default:
                    res.json({
                        state: "请求地址出错"
                    });
            }
        });
    },
    init : function (req, res, next) {
        var _id = (new mongoose.Types.ObjectId()).toString();
        var user = new userModel({
            _id : _id,
            uid : uuid.v4(),
            username : "admin",
            userpwd : bcrypt.hashSync("admin", 10),
            nickname : "我是管理员",
            brief : "介绍一下你自己吧，不要超过 200 字。",
            cover : "/public/images/article-2.jpg",
            avator : "/public/images/heart.jpg"
        })
        user.save(function (err) {
            if(err)
                return next(err);
        });


        var article = [
            new articleModel({
                articleid : uuid.v4(),
                title : 'LOFTER——专注兴趣，分享创作1',
                background : '/public/images/article-1.jpg',
                brief : '<p><strong>精致体验：</strong>LOFTER追求精致入微的视觉和交互体验，为每一片内容精心度量，让你的视角所触及的每一个像素，都蕴含独具匠心的精致设计。</p>',
                content : '<p><img src="/public/images/article-1.jpg"></p><p><strong>精致体验：</strong>LOFTER追求精致入微的视觉和交互体验，为每一片内容精心度量，让你的视角所触及的每一个像素，都蕴含独具匠心的精致设计。</p> <p><strong>极简易用：</strong>LOFTER在功能方面努力做到简单易用，希望让用户的每一次操作都能简单快捷、随性而为，从而满足目标用户碎片化、高效率的记录需求。</p> <p><strong>内容品质：</strong>LOFTER推崇纯粹的内容主义，摒弃一切与内容无关的琐碎和繁杂，并希望通过挖掘和推荐，打造一系列优秀的LOFTERS，激活目标用户的阅读兴趣。</p>',
                feature : "2",
                recommend : "2",
                status : "1",
                author : _id,

                create_at : Date.now(),
                update_at : Date.now()
            }),
            new articleModel({
                articleid : uuid.v4(),
                title : 'LOFTER——专注兴趣，分享创作2',
                background : '/public/images/article-2.jpg',
                brief : '<p>有这么一些人，喜欢拍点什么，写日志总是想不到标题，拍了一堆相片，不知如何组成一个文章，不知如何或者不想加上一些修饰就发布上来……</p>',
                content : '<p>有这么一些人，喜欢拍点什么，写日志总是想不到标题，拍了一堆相片，不知如何组成一个文章，不知如何或者不想加上一些修饰就发布上来……</p><p>他们生活随意，常常需要在工作台上贴上一些黄色的小纸条来提醒自己杂乱的工作，这时，真的需要一个LOFTER，也来参与一下热闹的互联网，微博你玩不起来，博客想不到主题，不知道如何发布组图也不想发布，你也不知道如何组织文字和整理思路，但是你有一堆的好作品或者一堆好相片，也想在大伙里路过一下，让大伙转过头来注意一下你……</p><p>于是LOFTER遇上了你，你遇上了LOFTER</p>',
                feature : "2",
                recommend : "2",
                status : "2",
                author : _id,

                create_at : Date.now(),
                update_at : Date.now()
            }),
        ]

        for(var item in article){
            article[item].save(function (err) {
                if(err)
                    return next(err);
            });
        }

        res.clearCookie("access-token");
        res.redirect("/admin");
    },
}

module.exports = apiController;