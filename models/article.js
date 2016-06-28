var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    articleid : {type : String, require : true},
    title : {type : String, require : true},
    background : {type : String, default : null},
    brief : {type : String, default : null},
    content : {type : String, default : null},
    feature : {type : String, require : true},
    recommend : {type : String, require : true},
    status : {type : String, require : true},
    author : {type : String, require : true},

    create_at : {type : Date, default : Date.now},
    update_at : {type : Date, default : Date.now}
});

mongoose.model("Article", articleSchema);