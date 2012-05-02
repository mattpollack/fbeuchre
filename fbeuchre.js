var canvas = document.getElementById("c"), gLoop;
var ctx = canvas.getContext("2d");
var cardSpacesX = [50, 160, 270, 380, 490], cardSpacesY = [460, 460, 460, 460, 460];
var cardAreaSpacesX = [200-30, 200-30, 310-30, 90-30], cardAreaSpacesY = [80, 250, 160, 160]; //P3, P1, P4, P2
var playerNameSpacesX = [200-30, 200-30, 310-30, 90-30], playerNameSpacesY = [77, 247, 157, 157];
var playerNames = [document.getElementById("player3").title,
			   document.getElementById("player1").title,
			   document.getElementById("player4").title, 
			   document.getElementById("player2").title];
var playerHands = new Array();
var cardHand = new Array();
var cardAreaCards = new Array();
var euchreDeck = new Array();
var topHUD = "";//"Welcome to Euchre!";
var turn = true, dealer = true, partnerDealer = true, cardDown = true;

function clear() {
	ctx.fillStyle = '#FFF';
	ctx.beginPath();
	ctx.rect(0, 0, canvas.width, canvas.height);
	ctx.closePath();
	ctx.fill();
}

function drawHUD() {
	for (i = 0; i < 4; i++) {
		ctx.fillStyle = "#000";
		ctx.fillText(playerNames[i], playerNameSpacesX[i], playerNameSpacesY[i]);
	}
	ctx.fillText(topHUD, 20, 20);
	
	var _img = new Image();
	
	if (turn == true) {
		if (dealer == true || partnerDealer == true) {
			_img.src = 'images/goalone.png';
			ctx.drawImage(_img, 440-30, 200-12);
		}
		_img.src = 'images/pass.png';
		ctx.drawImage(_img, 440-30, 255-12);
		if (dealer == true) {
			_img.src = 'images/pickup.png';
			ctx.drawImage(_img, 440-30, 310-12);
		}
		if (cardDown == true) {
			_img.src = 'images/suits.png';
			ctx.drawImage(_img, 431-30, 365-12);
		}
	}
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
