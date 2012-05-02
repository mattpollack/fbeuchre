var canvas = document.getElementById("c"), gLoop;
var ctx = canvas.getContext("2d");
var cardSpacesX = [50, 160, 270, 380, 490], cardSpacesY = [460, 460, 460, 460, 460]; //P3, P1, P4, P2
var cardAreaSpacesX = [270, 270, 380, 160], cardAreaSpacesY = [80, 250, 160, 160];
var playerNameSpacesX = [270, 270, 380, 160], playerNameSpacesY = [77, 247, 157, 157];
var playerNames = [document.getElementById("player3").title,
			   document.getElementById("player1").title,
			   document.getElementById("player4").title, 
			   document.getElementById("player2").title];
var playerHands = new Array();
var cardHand = new Array();
var cardAreaCards = new Array();
var euchreDeck = new Array();
var topHUD = "";//"Welcome to Euchre!";

function clear() {
	ctx.fillStyle = '#FFF';
	ctx.beginPath();
	ctx.rect(0, 0, canvas.width, canvas.height);
	ctx.closePath();
	ctx.fill();
}

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

function drawHUD() {
	for (i = 0; i < 4; i++) {
		ctx.fillStyle = "#000";
		ctx.fillText(playerNames[i], playerNameSpacesX[i], playerNameSpacesY[i]);
	}
	ctx.fillText(topHUD, 20, 20);
}

createDeck();
shuffleDeck();

for (i = 0; i < 4; i++) {
	cardAreaCards[i] = new card();
	cardAreaCards[i].x = cardAreaSpacesX[i];
	cardAreaCards[i].y = cardAreaSpacesY[i];
	cardAreaCards[i].width = 100;
	cardAreaCards[i].height = 150;
	cardAreaCards[i].vis = 0;
}
cardAreaCards[1].cardid = euchreDeck[20].cardid;
cardAreaCards[1].vis = 1

dealDeck();

for (i = 0; i < 5; i++) {
	cardHand[i] = new card();
	cardHand[i].x = cardSpacesX[i];
	cardHand[i].y = cardSpacesY[i];
	cardHand[i].width = 100;
	cardHand[i].height = 150;
	cardHand[i].cardid = playerHands[0][i].cardid;
	cardHand[i].vis = 1;
}
for (i = 0; i < 24; i++) {
	topHUD += euchreDeck[i].cardid[0] + euchreDeck[i].cardid[1] + ", ";
}

function gameLoop() {
	clear();
	for( i = 0; i < 4; i++) {
		cardAreaCards[i].draw();
		//alert(cardAreaCards[i].cardid)
	}
	for( i = 0; i < 5; i++) {
		cardHand[i].draw();
	}
	drawHUD();
	gLoop = setTimeout(gameLoop, 1000 / 50);
}

gameLoop();
