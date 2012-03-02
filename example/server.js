#!/usr/bin/env node

var app = require('express').createServer(),
    fs = require('fs'),
    YUIify = require('express-yui-serve');


YUIify(app, 'yui3');

app.get('/', function(req, res) {
    res.send(fs.readFileSync('./index.html', 'utf8'));
});

app.listen(8100);
