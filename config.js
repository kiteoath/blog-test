var path = require("path");

var config = {
    root : __dirname,
    tokenExpiresIn : "2d", //2天
    tokenSecretKey : "d3d3LnpqZ3QuY29t",
    mongodb : "mongodb://localhost/blog-test"
}
module.exports = config;