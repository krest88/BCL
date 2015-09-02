var BCL = {};

BCL.fps = 60;
BCL.cellSize = 30;

BCL.DrawBox = function(c) {
	c.beginPath();
	c.fillStyle = "white";
	c.lineWidth = 1;
	c.strokeStyle = "rgba(38,38,38,1)";

	for (var row = 0; row <= BCL.rowsInMap; row++) {
		c.moveTo(0, row*BCL.cellSize);
		c.lineTo(BCL.cellSize*BCL.colInMap, row*BCL.cellSize);
		c.stroke();
	}
	for (var column = 0; column <= BCL.colInMap; column++) {
		c.moveTo(column*BCL.cellSize, 0);
		c.lineTo(column*BCL.cellSize, BCL.cellSize*BCL.rowsInMap);
		c.stroke();
	}
	c.closePath();
};

BCL.DrawObjects = function(){
	for(var i = 0, len = BCL.mapMask.length; i<len; i++ ){

		BCL.context.fillStyle = BCL.BuildingMaker.prototype.cellsInfo[BCL.mapMask[i].type][BCL.mapMask[i].lvl].cellColor;
		BCL.context.fillRect(BCL.mapMask[i].coords.positionXBegin*BCL.cellSize,
			BCL.mapMask[i].coords.positionYBegin*BCL.cellSize,
			BCL.cellSize, BCL.cellSize);
	};

};

// GAME LOOP
BCL.Draw = function(){
	var requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame;
	setTimeout(function() {
		requestAnimationFrame(BCL.Draw);
		BCL.Render();

	}, 1000 / BCL.fps);
};


BCL.Render = function(){
	BCL.DrawBox(BCL.context);
	BCL.DrawObjects();
};

BCL.CreateMapMask = function() {
	return [];
};

BCL.currentButton = {
	state : false
};

BCL.BuildingMaker = function(){};
BCL.BuildingMaker.prototype.cellsInfo = {
	'House' : {
		1 : {
			cellColor: 'rgba(255, 86, 127, 1)'
		},
		2 : {
			cellColor: 'rgba(255, 0, 115, 1)'
		},
		3 : {
			cellColor: 'rgba(255, 17, 48, 1)'
		}
	},
	'Shop': {
		1 : {
			cellColor: 'rgba(55, 86, 127, 1)'
		},
		2 : {
			cellColor: 'rgba(55, 0, 115, 1)'
		},
		3 : {
			cellColor: 'rgba(55, 17, 48, 1)'
		}
	},
	'Road' : {
		1 : {
			cellColor: 'rgba(38, 38, 38, 1)'
		}
	}
};
BCL.BuildingMaker.prototype.getInfo = function() {
	console.log('Prise' + ' is ' + this.getPrise());
};
BCL.BuildingMaker.prototype.getPrise = function() {
	return this.coeff * 1000 * this.lvl;
};
BCL.BuildingMaker.prototype.save = function(coords){
	this.coords = coords;
	BCL.mapMask.push(this);
	//localStorage.mapMask.push(this);
};

BCL.BuildingMaker.factory = function(type, lvl){
	var constr = type,
		newBuilding;
	if (typeof BCL.BuildingMaker[constr] !== 'function') {
		throw {
			name: 'Error',
			message: constr + ' doesn’t exist'
		};
	};
	if (typeof BCL.BuildingMaker[constr].prototype.getInfo !== 'function') {
		BCL.BuildingMaker[constr].prototype = new BCL.BuildingMaker();
	};

	newBuilding = new BCL.BuildingMaker[constr](type, lvl);
	return newBuilding;
};

BCL.BuildingMaker.House = function(type, lvl) {
	this.type = type;
	this.coeff = 0.5;
	this.lvl = lvl;
	this.coords = {
		positionXBegin : 0,
		positionXEnd: 0,
		positionYBegin: 0,
		positionYEnd: 0};
};

BCL.BuildingMaker.Shop = function(type, lvl) {
	this.type = type;
	this.coeff = 0.7;
	this.lvl = lvl;
	this.coords = {
		positionXBegin : 0,
		positionXEnd: 0,
		positionYBegin: 0,
		positionYEnd: 0};
};

BCL.BuildingMaker.Road = function(type, lvl) {
	this.type = type;
	this.coeff = 0.2;
	this.lvl = lvl;
	this.coords = {
		positionXBegin : 0,
		positionXEnd: 0,
		positionYBegin: 0,
		positionYEnd: 0};
};
