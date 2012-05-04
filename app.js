var express = require('express')
  , fs = require('fs')
  , everyauth = require('everyauth')
  , passhash = require('password-hash')
  , nano = require('nano')('http://localhost:5984')
  , app = require('express').createServer();
  , db = nano.use('euchre')
  , gameswaiting
  , gamesplaying
  , players;

function insertCallback(err, body) {
    console.log(err);
    console.log(body);
}

db.get('incompletegames', function(err, body) {
    if (!err)
	gameswaiting = body;
});

db.get('gamesinprogress', function(err, body) {
    if (!err)
	gamesplaying = body;
});

db.get('users', function(err, body) {
    if (!err)
	players = body;
});

app.post('/newgame', function(req, res, next) {
    if (gameswaiting.length == 0)
	create_game();
    else {
	gameswaiting[0].players.push(req.user.id);
	if (gameswaiting[0].players.length == 4) {
	    gamesplayinga.append(gameswaiting.pop());
	    db.insert(gamesplaying, 'gamesinprogress', insertCallback);
	}
    }
    db.insert(gameswaiting, 'incompletegames', insertCallback);
    res.redirect('/');
});

/*app.get('/', function(req, res) {
    fs.readFile('index.html', function(err, data) {
	if (err) throw err;
	res.send(data, {'Content-type': 'text/html'});
    });
});*/

app.use(express.static(__dirname + '/public'));
app.listen(4015);