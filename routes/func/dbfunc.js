var express = require('express');
var mongo = require('mongodb').MongoClient;

module.exports.insert = function (coll, data, result) {
    mongo.connect(global.mongourl, function (err, db) {
        if (err) throw err;
        var collection = db.collection(coll);
        collection.insert(data, function (err, res) {
            if (err) throw err;

            if (res)
                result(res.ops[0]);
            else
                result(false);
            db.close();
        })


    })
}

module.exports.find = function (coll, quary,selection, result) {
    mongo.connect(global.mongourl, function (err, db) {
        if (err) throw err;
        var collection = db.collection(coll);
        collection.find(quary,selection).toArray(function (err, res) {
            if (err) throw err;
            result(res);
            db.close();
        })


    })
}
module.exports.findAll = function (coll, selection, result) {
    mongo.connect(global.mongourl, function (err, db) {
        if (err) throw err;
        var collection = db.collection(coll);
        collection.find({}, selection).toArray(function (err, res) {
            if (err) throw err;
            result(res);
            db.close();
        })

    })
}
module.exports.getChat = function ( from,to, result) {
    mongo.connect(global.mongourl, function (err, db) {
        if (err) throw err;
        var collection = db.collection('chat');
        collection.find({$or:[{from:to,to:from},{from:from,to:to}]}).limit(50).sort({_id:1}).toArray(function (err, res) {
            if (err) throw err;
            result(res);
            db.close();
        })


    })
}

module.exports.update = function (coll, key, newval) {
    mongo.connect(global.mongourl, function (err, db) {
        if (err) throw err;
        var collection = db.collection(coll);
        collection.updateMany(key, {$set: newval},{w:1,multi:true}, function (err, res) {
            if (err) throw err;
            /*if (res)
                result(true);
            else
                result(false);*/
            db.close();
        })

    })
}

module.exports.count = function (coll,query,result) {
    mongo.connect(global.mongourl, function (err, db) {
        if (err) throw err;
        var collection = db.collection(coll);
        collection.count(query, function (err, res) {
            if (err) throw err;
            result(res);
            db.close();
        })

    })
}
