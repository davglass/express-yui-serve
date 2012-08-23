[![build status](https://secure.travis-ci.org/davglass/express-yui-serve.png)](http://travis-ci.org/davglass/express-yui-serve)
Express Middleware for serving YUI
==================================

Middleware for express that allows you to serve YUI locally
from the installed node package.


Installation
------------
    npm i express express-yui-serve


Usage
-----

Require the `express-yui-serve` package and give it the app and the route to attach to.
In the below example, `app` is my express app and `yui3` is my route.

This wil create the following routes on your app:

    /yui3/seed
    /yui3/combo
    /yui3/*

The seed route is where you point your JS to load a pre-configured YUI seed file.
This route also supports the `filter` parameter:

```html
<script src="/yui3/seed"></script>
<script src="/yui3/seed?filter=raw"></script>
<script src="/yui3/seed?filter=debug"></script>
```

Now you need to expose these routes:

```javascript
var app = require('express').createServer(),
    YUIify = require('express-yui-serve');

YUIify(app);
//Routes are create for you now..
```

Example
-------

```javascript
#!/usr/bin/env node

var app = require('express').createServer(),
    fs = require('fs'),
    YUIify = require('express-yui-serve');


YUIify(app, 'yui3');

app.get('/', function(req, res) {
    res.send(fs.readFileSync('./index.html', 'utf8'));
});

app.listen(8100);
```

```html
<!doctype html>
<html>

<body>
<script src="/yui3/seed?filter=debug"></script>
<script>
YUI().use('node', function(Y) {
    Y.one('body').setStyle('backgroundColor', 'green');
});
</script>
</body>
</html>
```
