
var combo = require('combohandler');
    fs = require('fs'),
    path = require('path'),
    exists = fs.exists || path.exists,
    YUI = require('yui').YUI;

//Get the base directory
var base = (YUI()).config.base;


var middle = function(req, res, next) {
    console.log('URL', req.url);

    var m = req.url.match(req.route.regexp),
        file;

    if (m && m[1]) {
        file = path.join(base, m[1]);
        console.log('File', file);
        exists(file, function(x) {
            if (x) {
                fs.readFile(file, function(err, data) {
                    res.contentType(file);
                    res.body = data;
                    next();
                });
            } else {
                next('File does not exist');
            }
        });
    } else {
        next('Failed to parse route');
    }

};

var stamp = function(host, filter, route) {
    var seedStamp = '\n\n/* Stamping Seed File */\n' + 
        'YUI.applyConfig({\n' + 
        '   comboBase: "http://' + host + '/' + route + '/combo?",\n' + 
        '   base: "http://' + host + '/' + route + '/",\n' + 
        '   combine: true,\n' + 
        '   root: "",\n' + 
        '   filter: "' + filter + '"\n' + 
        '});\n';
    return seedStamp;
};

var seed = function(route) {
    return function(req, res, next) {
        var filt = req.query.filter ? req.query.filter : 'min',
            seedFile = 'yui/yui-min.js';

        switch (filt) {
            case 'raw':
                seedFile = 'yui/yui.js';
                break;
            case 'debug':
                seedFile = 'yui/yui-debug.js';
                break;
        }
        
        var file = path.join(base, seedFile);
        fs.readFile(file, function(err, data) {
            res.contentType(file);

            data += stamp(req.headers.host, filt, route);

            res.body = data;
            next();
        });
    };
};


var createRoutes = function(app, route) {

    app.get('/' + route + '/seed', seed(route), function(req, res, next) {
        res.send(res.body);
    });

    app.get('/' + route + '/combo', combo.combine({ rootPath: base }), function(req, res, next) {
        res.send(res.body);
    });
    app.get('/' + route + '/'+'*', middle, function(req, res, next) {
        res.send(res.body);
    });

    
};

module.exports = function(app, route) {

    createRoutes(app, route);
    
};
