var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    articleid : {type : String, require : true},
    title : {type : String, require : true},
    background : {type : String, default : null},
    brief : {type : String, default : null},
    content : {type : String, default : null},
    feature : {type : String, default : null},
    recommend : {type : String, default : null},
    status : {type : String, default : null},
    author : {type : String, ref : "User"},

    create_at : {type : Date, default : Date.now},
    update_at : {type : Date, default : Date.now}
});

mongoose.model("Article", articleSchema);