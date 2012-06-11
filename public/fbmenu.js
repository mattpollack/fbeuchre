function menu() {
	this.menuItems = new Array();
	this.locationListener = new Array();
		
	this.add = function(_string) {
		this.menuItems.push(_string);
		var y = 320 - ((this.menuItems.length/2) * 80);
		for (i = 0; i < this.menuItems.length; i++) {
			this.locationListener[i] = new Array();
			this.locationListener[i].push(123);
			this.locationListener[i].push(y);
			y += 50;
		}
	}
	
	this.draw = function() {
		var _bg = new Image();
		_bg.src = 'images/mainMenu.png';
		ctx.drawImage(_bg, 0, 0);
		
		ctx.font = '30px sans-serif';
		ctx.fillStyle = "#FFF";
		ctx.textAlign = "center";
		
		var y = 320 - ((this.menuItems.length/2) * 80);
		for (i = 0; i < this.menuItems.length; i++) {
			var _ibg = new Image();
			_ibg.src = 'images/menuItemBg.png';
			ctx.drawImage(_ibg, 123, y-32);
			
			ctx.fillText(this.menuItems[i], 320, y);
			y += 60;
		}
	}
	
	this.on_canvas_click = function(ev) {
	    var x = ev.clientX - canvas.offsetLeft;
	    var y = ev.clientY - canvas.offsetTop;
	    
	    for (i = 0; i < gameMenu.locationListener.length; i++) {
	    	if (x >= gameMenu.locationListener[i][0] && x <= gameMenu.locationListener[i][0]+394 &&
	    		gameMenu.locationListener[i][1] >= y && gameMenu.locationListener[i][1] <= y+45) {
	    		
	    		if (gameMenu.menuItems[i] == "Join Game" || gameMenu.menuItems[i] == "Create Game") {
					var xmlhttp = new XMLHttpRequest();
					xmlhttp.onreadystatechange = function() {
						if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					    	jsonres = JSON.parse(xmlhttp.responseText); // json response
					    }
					}
					xmlhttp.open("POST","/newgame",true);
					xmlhttp.send("null");
	    			waitingForGame = true;
	    		}
	    	}	
	    }
	}
}