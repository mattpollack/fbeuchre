var canvas = document.getElementById("c"), gLoop;
var ctx = canvas.getContext("2d");
var playing = false;
var cardSpacesX = [50, 160, 270, 380, 490], cardSpacesY = [460, 460, 460, 460, 460];
var cardAreaSpacesX = [200-40, 200-40, 310-20, 90-60], cardAreaSpacesY = [80, 250, 160, 160]; //P3, P1, P4, P2
var playerNames = [document.getElementById("player3").title,
		   document.getElementById("player1").title,
		   document.getElementById("player4").title, 
		   document.getElementById("player2").title];
var playerHands = new Array();
var cardHand = new Array();
var cardAreaCards = new Array();
var euchreDeck = new Array();
var topHUD = "";
var turn = true, dealer = true, partnerDealer = true, cardDown = true;

function clear() {
    canvas.width = canvas.width;
}

function drawHUD() {
    ctx.font = '15px sans-serif';
    for (i = 0; i < 4; i++) {
	ctx.fillStyle = "#FFF";
	ctx.textAlign = "center";
	ctx.fillText(playerNames[i], (cardAreaSpacesX[i]+50), cardAreaSpacesY[i]-4);
    }
    ctx.font = '25px sans-serif';
    topHUD = "Player updates here ex: John Smith picked spades";
    ctx.fillText(topHUD, 320, 30);
    
    if (turn == true) {
	if (dealer == true || partnerDealer == true) {
	    var _img = new Image();
	    _img.src = 'images/goalone.png';
	    ctx.drawImage(_img, 440-10, 200-12);
	}
	var _img = new Image();
	_img.src = 'images/pass.png';
	ctx.drawImage(_img, 440-10, 255-12);
	if (dealer == true) {
	    var _img = new Image();
	    _img.src = 'images/pickup.png';
	    ctx.drawImage(_img, 440-10, 310-12);
	}
	if (cardDown == true) {
	    var _img = new Image();
	    _img.src = 'images/suits.png';
	    ctx.drawImage(_img, 431-10, 365-12);
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

/*
for (i = 0; i < 24; i++) {
topHUD += euchreDeck[i].cardid[0] + euchreDeck[i].cardid[1] + ", ";
}
*/
gameMenu = new menu();
gameMenu.add("Join Game");
gameMenu.add("Create Game");
gameMenu.add("Training");
gameMenu.add("Help");

function gameLoop() {
    clear();
    if (playing == true) {
	    for( i = 0; i < 4; i++) {
		cardAreaCards[i].draw();
	    }
	    for( i = 0; i < 5; i++) {
		cardHand[i].draw();
	    }
	    drawHUD();
    } else {
    	gameMenu.draw();
    }
    gLoop = setTimeout(gameLoop, 1000/50);
    //setTimeout(gameLoop, 3000);
}

canvas.addEventListener('click', gameMenu.on_canvas_click, false);

gameLoop();
