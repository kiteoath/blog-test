var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var navigationSchema = new Schema({
    id : {type : String, require : true},
    name : {type : String, require : true},
    url : {type : String, default : null}
});

mongoose.model("Navigation", navigationSchema);