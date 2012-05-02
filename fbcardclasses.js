function card() {
	this.x, this.y;
	this.width, this.height;
	this.cardid = new Array();
	this.img = new Image();
	this.vis = 0;//0 = not visible (backside or gone), 1 = visible (frontside), 2 = not usable (ex. because of suit)

	this.draw = function() {
		var _img = new Image();
		if (this.vis == 1) {
			_img.src = 'images/deck.png';
			if (this.cardid[0] == "c") {
				ctx.drawImage(_img, 100*(Math.floor(parseFloat(this.cardid[1])-9)), 0, this.width, this.height, this.x, this.y, this.width, this.height);
			} else if (this.cardid[0] == "s") {
				ctx.drawImage(_img, 100*(Math.floor(parseFloat(this.cardid[1])-9)), 150, this.width, this.height, this.x, this.y, this.width, this.height);
			} else if (this.cardid[0] == "h") {
				ctx.drawImage(_img, 100*(Math.floor(parseFloat(this.cardid[1])-9)), 300, this.width, this.height, this.x, this.y, this.width, this.height);
			} else if (this.cardid[0] == "d") {
				ctx.drawImage(_img, 100*(Math.floor(parseFloat(this.cardid[1])-9)), 450, this.width, this.height, this.x, this.y, this.width, this.height);
			}
		} else if (this.vis == 0) {
			_img.src = 'images/cardback.png';
			ctx.drawImage(_img, this.x, this.y, this.width, this.height);
		}
		ctx.fillStyle = "#000";
		ctx.fillText(this.cardid, this.x + 10+15, this.y + 13);
		
	}
}
function createDeck() {
	var suit = "s";
	for (x = 1; x <= 6; x++) {
		var _card = new card();
	    _card.cardid[0] = suit;
	    _card.cardid[1] = x + 8;
	    euchreDeck.push(_card);
	}
	
	suit = "c";
	for (x = 1; x <= 6; x++) {
		var _card = new card();
	    _card.cardid[0] = suit;
	    _card.cardid[1] = x + 8;
	    euchreDeck.push(_card);
	}
	
	suit = "h";
	for (x = 1; x <= 6; x++) {
		var _card = new card();
	    _card.cardid[0] = suit;
	    _card.cardid[1] = x + 8;
	    euchreDeck.push(_card);
	}
	
	suit = "d";
	for (x = 1; x <= 6; x++) {
		var _card = new card();
	    _card.cardid[0] = suit;
	    _card.cardid[1] = x + 8;
	    euchreDeck.push(_card);
	}
}

function shuffleDeck() {
	var roll = 0;
    var _tempCards = new Array();
	while (euchreDeck.length != 0) {
    	roll = Math.floor(Math.random()*euchreDeck.length);
    	_tempCards.push(euchreDeck[roll]);
       	euchreDeck.splice(roll,1);
    }
    euchreDeck = _tempCards;
}

function dealDeck() {
	var count = 0;
	for (i = 0; i < 4; i++) {
		playerHands[i] = new Array();
		for (x = 0; x < 6; x++) {
			playerHands[i].push(euchreDeck[count]);
			count += 1;
		}
	}
}
