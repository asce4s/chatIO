var express = require('express');
var router = express.Router();
var user = require('./func/user');
var ssn = require('./func/sessions');


router.get('/', function (req, res, next) {

    if (req.cookies.remember) {
        ssn.create(req, 'user', req.cookies.remember);
        res.cookie("remember", req.cookies.remember, {expire: new Date() + 9999});
        res.redirect('/home');
    }else{
        res.render('index', {title: 'Ace Chat'});
    }
});

router.get('/val', function (req, res, next) {
    res.render('index', {title: 'Ace Chat'});
});

router.post('/val', function (req, res) {
    var sendStatus = function (s) {
        res.send(s);

    };

    user.validateUser(req, function (s) {
        sendStatus(s);
    })


})

router.post('/', function (req, res, next) {
    var sendStatus = function (s) {
        res.send(s);
    };


    if (req.body.fid.toString() == 'login') {

        user.login(req, function (s) {
            if(s) {
                ssn.create(req, 'user', req.body.uName);
                if (req.body.remember == 'on') {
                    res.cookie("remember", req.body.uName, {expire: new Date() + 9999});
                }
            }
                sendStatus({
                    state: s,
                    url: '/home',
                    fid: 'login'
                });


            })


    } else if (req.body.fid.toString() == "reg") {

        user.createUser(req, function (s) {
            sendStatus(s);
        });

    }


});
router.get('/logout', function(req, res) {
    var user=ssn.get(req,'user');
    ssn.destroy(req,'user');
    res.clearCookie('remember');
    res.redirect('/');
})

module.exports = router;
