var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    _id : {type : String, unique : true, require : true},
    uid : {type : String, unique : true, require : true},
    username : {type : String, unique : true, require : true},
    userpwd : {type : String, require : true},
    nickname : {type : String, default : null},
    brief : {type : String, default : null},
    cover : {type : String, default : null},
    avator : {type : String, default : null},
    
    articles : [{type : Schema.Types.ObjectId, ref : "Article"}]
});


mongoose.model("User", userSchema);