var express = require('express')
  , fs = require('fs')
  , FB = require('facebook')
  , io = require('socket.io')
  , crypto = require('crypto')
  , everyauth = require('everyauth')
  , configfile = require('./config.js')
  , jade = require('jade')
  , nano = require('nano')('http://localhost:5984')
  , app = require('express').createServer()
  , db = nano.use('euchre')
  , gameidtowaiting = new Object();
  , gameidtoplaying = new Object();
  , playeridtosocket = new Object();
  , gameswaiting
  , gamesplaying
  , newgameid
  , players;

io = io.listen(app);

io.sockets.on('connection', function(socket) {
    socket.on('new', function(data) {
	playeridtosocket[data.pid] = socket.id;
    });
}

function insertCallback(err, body) {
    console.log(err);
    console.log(body);
}

function createUser(fbdata) {
    console.log(fbdata);
    var id = fbdata.user_id
    players[id] = new Object;
    players[id].id = fbdata.user_id;
    players[id].name = fbdata.name; // not sure if right
    players[id].imgurl = fbdata.picture; // not sure if right
    FB.api(fbdata.user_id, { fields: ['name'] }, function (res) {
	if (res && !res.error)
	    players[id].name = res.name;
	else
	    console.log(res.error);
    });
    db.insert(players, 'users', insertCallback);
    return players[id];
}

function CreateGame(pid) {
    this.gid = newgameid;
    newgameid++;
    db.insert(newgameid, 'newgid', insertCallback);
    this.players = new Array();
    this.players.push(players[pid]);
    return this;
}

db.get('newgid', function(err, body) {
    if (!err)
	newgameid = body;
});

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
    var data, createdgid;
    if (gameswaiting.length == 0) {
	data = new CreateGame(req.user.id);
	createdgid = data.gid;
	gameidtowaiting[createdgid] = gameswaiting.length;
	gameswaiting.push(data);
    } else {
	gameswaiting[0].players.push(players[req.user.id]);
	data = gameswaiting[0];
	if (gameswaiting[0].players.length == 4) {
	    gameidtoplaying[data.gid] = gamesplaying.length;
	    gamesplaying.push(gameswaiting.shift());
	    db.insert(gamesplaying, 'gamesinprogress', insertCallback);
	}
	for (player in data.players)
	    if (data.players[player].id != req.user.id)
		io.sockets[playeridtosocket[data.players[player].id]].emit('update', data);
    }
    db.insert(gameswaiting, 'incompletegames', insertCallback);
    res.send(data, {'Content-type': 'text/json'});
});

app.post('/leavegame', function(req, res, next) {
    var jsonasstring = "";
    req.on('data', function(stuff) {
	jsonasstring += stuff.toString();
	try {
	    var jsontouse = JSON.parse(jsonasstring);
	    var newplayersforgame = new Array();
	    var data;
	    if (gameidtowaiting[jsontouse.gid]) {
		var waitid = gameidtowaiting[jsontouse.gid];
		for (player in gameswaiting[waitid].players)
		    if (gameswaiting[waitid].players[player].id != req.user.id)
			newplayersforgame.push(gameswaiting[waitid].players[player]);
		if (newplayers.length == 0) {
		    gameswaiting.splice(waitid, 1);
		    for (waitgid in gameidtowaiting) {
			if (gameidtowaiting[waitgid] > waitid)
			    gameidtowaiting[waitgid]--;
			else (gameidtowaiting[waitgid] == waitid)
			    gameidtowaiting[waitgid] = null;
		    }
		    data = null;
		} else {
		    gameswaiting[waitid].players = newplayersforgame;
		    data = gameswaiting[waitid];
		}
	    } else if (gameidtoplaying[jsontouse.gid]) {
		var playid = gameidtoplaying[jsontouse.gid];
		for (player in gamesplaying[playid].players)
		    if (gamesplaying[playid].players[player].id != req.user.id)
			newplayersforgame.push(gamesplaying[playid].players[player]);
		if (newplayers.length == 0) {
		    gamesplaying.splice(playid, 1);
		    for (playgid in gameidtoplaying) {
			if (gameidtoplaying[playgid] > playid)
			    gameidtoplaying[playgid]--;
			else (gameidtoplaying[playgid] == playid)
			    gameidtoplaying[playgid] = null;
		    }
		    data = null;
		} else {
		    gameswaiting[waitid].players = newplayersforgame;
		    data = gameswaiting[waitid];
		}
	    } else {
		console.log("WHAT IS THIS SHIT");
		res.send("{success: False}", {'Content-type': 'text/json'});
		return;
	    }
	    if (data)
		for (player in newplayersforgame)
		    io.sockets[playeridtosocket[newplayersforgame[player].id]].emit('update', data)
	    res.send("{success: True}", {'Content-type': 'text/json'});
	} catch(SyntaxError) {
	    console.log(SyntaxError);
	    res.send("{success: False}", {'Content-type': 'text/json'});
	}
    });
});
    
//app.get('/listgames', function(req, res, next) {
//    
//});

app.use(express.static(__dirname + '/public'));
app.listen(process.env.port || 4012);