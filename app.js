var express = require('express')
  , fs = require('fs')
  , everyauth = require('everyauth')
  , passhash = require('password-hash')
  , app = require('express').createServer();

/*app.get('/', function(req, res) {
    fs.readFile('index.html', function(err, data) {
	if (err) throw err;
	res.send(data, {'Content-type': 'text/html'});
    });
});*/

app.use(express.static(__dirname + '/public'));
app.listen(4015);