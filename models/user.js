var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    uid : {type : String, unique : true, require : true},
    username : {type : String, unique : true, require : true},
    userpwd : {type : String, require : true},
    nickname : {type : String, default : null},
    brief : {type : String, default : null},
    cover : {type : String, default : null},
    avator : {type : String, default : null}
});


mongoose.model("User", userSchema);