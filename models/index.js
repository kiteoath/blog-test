var config = require("../config");
var mongoose = require("mongoose");

var option = {
    server : {
        poolSize : 20
    }
};

mongoose.connect(config.mongodb, option, function(err){
    if(err){
        console.log("Connect Error: Can not connect to " + config.mongodb);
        process.exit(1);
    }
});

require("./article");
require("./user");
require("./settings");
require("./navigation");

module.exports = {
    Article : mongoose.model("Article"),
    User : mongoose.model("User"),
    Settings : mongoose.model("Settings"),
    Navigation : mongoose.model("Navigation")
}