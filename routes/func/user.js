var express = require('express');
var mongo = require('mongodb').MongoClient;
var bcrypt = require('bcryptjs');

var salt = bcrypt.genSaltSync(10);
module.exports.login = function (req, res) {
    mongo.connect(global.mongourl, function (err, db) {
        if (err) throw err;
        var collection = db.collection('user');
        var username = req.body.uName,
            password = req.body.uPass;


        collection.findOne({username: username}, function (err, data) {
            if (err) throw err;
            if (data) {
                var state = bcrypt.compareSync(password, data.password);
                //console.log(state,password,data.password);

                res(state);
            } else {
                res(false);
            }
            db.close();

        });
    });


}


module.exports.createUser = function (req, status) {
    mongo.connect(global.mongourl, function (err, db) {
        if (err) throw err;
        var collection = db.collection('user');


        var username = req.body.uName,
            password = req.body.uPass,
            cpassword = req.body.ucPass,
            email = req.body.email;


        if (err) throw err;

        var hash = bcrypt.hashSync(password, salt);
        console.log(password);
        collection.insert({
            username: username,
            password: hash,
            email: email,
        }, function () {
            status({
                fid: 'reg',
                eType: 'success',
                msg: 'Account Created Sucessfully',
            })

            db.close();

        })


    })
};

module.exports.validateUser = function (req, res) {
    mongo.connect(global.mongourl, function (err, db) {
        if (err) throw err;
        var collection = db.collection('user');
        var email = function () {
            collection.find({email: req.body.data}).toArray(function (err, data) {
                if (data.length > 0) {
                    res({
                        fid: 'reg',
                        eType: 'email',
                        status: false,
                        msg: 'This email already registered',
                    })
                }
                else {
                    res({
                        fid: 'reg',
                        eType: 'email',
                        status: true,
                    })
                }
                db.close();
            });
        }

        var user = function () {
            collection.find({username: req.body.data}).toArray(function (err, data) {
                if (data.length > 0) {
                    res({
                        fid: 'reg',
                        eType: 'user',
                        status: false,
                        msg: 'This user already registered',
                    })
                } else {
                    res({
                        fid: 'reg',
                        eType: 'user',
                        status: true,
                    })
                }
                db.close();
            });
        }

        var pass = function () {
            if (req.body.pass != req.body.cpass) {
                res({
                    fid: 'reg',
                    eType: 'pval',
                    status: false,
                    msg: 'Passwords doesn`t match'
                })
            }
            else {
                res({
                    fid: 'reg',
                    eType: 'pval',
                    status: true,
                })
            }
        }

        switch (req.body.typ) {
            case 'username':
                user();
                break;
            case 'email':
                email();
                break;
            case 'password':
                pass();
                break;
        }


    })
};

