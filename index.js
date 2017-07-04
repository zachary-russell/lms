var express = require('express');
var app = express();
var db = require('./lib/db/rethinkdb.js');
var pug = require('pug');
app.set('view engine', 'pug');
db.init(function(err, response) {
    if(err) throw err;
})
app.get('/', function(req, res) {
    var params = req.query
    db.getLinks(params, function(err, response) {
        if(err) throw err;
        res.send(response);
    })
});
app.get('/hello', function(req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!' })
});

app.listen(3000, function() {
    console.log('app is listening on port 3000!');
})

