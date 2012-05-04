var express = require('express')
  , fs = require('fs')
  , everyauth = require('everyauth')
  , configfile = require('./config.js')
  , jade = require('jade')
  , nano = require('nano')('http://localhost:5984')
  , app = require('express').createServer()
  , db = nano.use('euchre')
  , gameswaiting
  , gamesplaying
  , players;

function insertCallback(err, body) {
    console.log(err);
    console.log(body);
}

function createUser(fbdata) {
    console.log(fbdata);
    players[fbdata.id] = fbdata;
    db.insert(players, 'users', insertCallback);
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

everyauth.everymodule.findUserById( function (id, callback) {
    callback(null, players[id]);
});

everyauth.facebook
    .appId('304117199665452')
    .appSecret(configfile.appsecret)
    .findOrCreateUser( function(session, accessToken, accessTokenExtra, fbUserMetadata) {
	return players[fbUserMetadata.id] ||
	    createUser(fbUserMetadata);
    })
    .redirectPath('/')

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({'secret': 'spadesalone'}));
app.use(everyauth.middleware());
app.use(app.router);
everyauth.helpExpress(app);
app.set('view engine', 'jade');

app.post('/newgame', function(req, res, next) {
    if (gameswaiting.length == 0)
	gameswaiting.push(new CreateGame());
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

app.get('/', function(req, res) {
    res.render('index.jade');
});

app.use(express.static(__dirname + '/public'));
app.listen(process.env.port || 4015);