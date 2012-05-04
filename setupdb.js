function insertCallback(err, body) {
    console.log(err);
    console.log(body);
}

var nano = require('nano')('http://localhost:5984');
nano.db.create('euchre', function() {
    var db = nano.use('euchre')
      , incompletegames = new Object
      , gamesinprogress = new Object
      , users = new Object;
    gamesinprogress.id = 0;
    incompletegames.id = gamesinprogress.id;
    users.id = 0;
    db.insert(incompletegames, 'incompletegames', insertCallback);
    db.insert(gamesinprogress, 'gamesinprogress', insertCallback);
    db.insert(users, 'users', insertCallback);
});