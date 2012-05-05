function menu() {
	this.menuItems = new Array();
	
	this.add = function(_string) {
		this.menuItems.push([_string, "OBJECT WILL GO HERE"]);
	}
	
	this.draw = function() {
		var _bg = new Image();
		_bg.src = 'images/mainMenu.png';
		ctx.drawImage(_bg, 0, 0);
		
		ctx.font = '30px sans-serif';
		ctx.fillStyle = "#FFF";
		ctx.textAlign = "center";
		
		var y = 320 - ((this.menuItems.length/2) *50);
		for (i = 0; i < this.menuItems.length; i++) {
			var _ibg = new Image();
			_ibg.src = 'images/menuItemBg.png';
			ctx.drawImage(_ibg, 123, y-32);
			
			ctx.fillText(this.menuItems[i][0], 320, y);
			y += 50;
		}
	}
}

function joinGame() { }
function createGame() { }