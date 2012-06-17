function waitscreen() {
	this.draw = function() {
		//width hight 960px;
		//135px
		ctx.fillStyle = "#000";
		ctx.fillRect(20, 232, 135, 135);
		ctx.fillRect(175, 232, 135, 135);
		ctx.fillRect(330, 232, 135, 135);
		ctx.fillRect(485, 232, 135, 135);

		var player1 = "player",//gameObject.players[0].name, 
			player2 = "player",//gameObject.players[1].name, 
			player3 = "waiting...",//gameObject.players[2].name, 
			player4 = "waiting...";//gameObject.players[3].name;

		ctx.font = '20px sans-serif';
    	ctx.fillStyle = "#FFF";
		ctx.textAlign = "left";
		ctx.fillText(player1, 20, 232+135+20);
		ctx.fillText(player2, 175, 232+135+20);
		ctx.fillText(player3, 330, 232+135+20);
		ctx.fillText(player4, 485, 232+135+20);
	}
}