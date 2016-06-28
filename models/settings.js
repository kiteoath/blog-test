var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var settingsSchema = new Schema({
    name : {type : String, require : true},
    brief : {type : String, default : null},
    logo : {type : String, default : null},
    background : {type : String, default : null},
    page : {type : String, require : true},
    code_head : {type : String, default : null},
    code_foot : {type : String, default : null},
});

mongoose.model("Settings", settingsSchema);