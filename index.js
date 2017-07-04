var express = require('express');
var app = express();
var db = require('./lib/db/rethinkdb.js');
db.init(function(err, response) {
    if(err) throw err;
})
app.get('/', function(req, res) {
    db.addLink(1, {name: "The_link"}, function(err, response) {
          if(err) throw err;

    });
    var params = req.query
    db.getLinks(params, function(err, response) {
        if(err) throw err;
        res.send(response);
    })
});

app.listen(3000, function() {
    console.log('app is listening on port 3000!');
})

