var express = require('express')
  , fs = require('fs')
  , FB = require('fb')
  , crypto = require('crypto')
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
    var id = fbdata.user_id
    players[id] = new Object;
    players[id].id = fbdata.user_id;
    FB.api(fbdata.user_id, { fields: ['name'] }, function (res) {
	if (res && !res.error)
	    players[id].name = res.name;
	else
	    console.log(res.error);
    });
    db.insert(players, 'users', insertCallback);
    return players[id];
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

everyauth.facebookCanvas
    .canvasPath('/')
    .canvasPage('http://apps.facebook.com/cardeuchre')
    .appId('304117199665452')
    .appSecret(configfile.appsecret)
    .findOrCreateUser( function(session, accessToken, accessTokenExtra, fbUserMetadata) {
	if (fbUserMetadata.user_id)
	    return players[fbUserMetadata.user_id]
	else
	    return createUser(fbUserMetadata);
    })
    .redirectPath('/')

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({'secret': 'spadesalone'}));
app.use(everyauth.middleware());
app.use(app.router);
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
app.listen(process.env.port || 4012);