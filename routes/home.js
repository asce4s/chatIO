var express = require('express');
var router = express.Router();
var ssn=require('./func/sessions');
var db=require('./func/dbfunc');

router.get('/', function(req, res, next) {

    if(ssn.get(req,'user')) {
        var currentUser=ssn.get(req,'user');
        db.update('user',{username:currentUser},{status:true});

            res.render('home', {
                title: 'Ace Chat',
                user:ssn.get(req,'user'),

            });


    }else{
        res.redirect('/');
    }


});

router.post('/',function(req,res){
    var user=ssn.get(req,'user');
    if(req.body.req=='uname'){
        res.send(user);
    }
})


module.exports = router;