var express = require('express');
var router = express.Router();
module.exports.create=function(req,name,value){
    req.session.name=value;
}
module.exports.get=function(req,name){
    return req.session.name;
}
module.exports.destroy=function(req,name){
    delete req.session.name;
}

module.exports.update=function(req,name,value){
    req.session.name=value;
}
