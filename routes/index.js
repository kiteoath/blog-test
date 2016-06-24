var path = require("path");
var express = require('express');
var router = express.Router();

var adminController = require("../controllers/admin");
var apiController = require("../controllers/api");
var blogController = require("../controllers/blog");

/* GET home page. */
router.use('/ueditor/ue', apiController.ueditor(path.join(__dirname, '../')));
router.get('/article/:articleid?', blogController.article);
router.get('/author/:authorid?', blogController.author);
router.get('/', blogController.home);

/* GET admin page. */
router.route('/admin').all(adminController.checkLogin).get(function(req, res, next){
    res.redirect("/admin/article/list")
});
router.route('/admin/login').get(adminController.showLogin).post(adminController.login);
router.route('/admin/reg').get(adminController.showReg).post(adminController.register);
router.get('/admin/logout', adminController.logout);
router.get('/admin/init', apiController.init);

router.route('/admin/article/edit/:articleid?').all(adminController.checkLogin).get(adminController.showArticle).post(adminController.saveArticle);
router.route('/admin/article/list').all(adminController.checkLogin).get(adminController.showArticleList);

router.route('/admin/uploadfile').all(adminController.checkLogin).post(apiController.upload);

module.exports = router;
