var BCL = (function() {

	var fps = 60,
		cellSize = 30,
		currentButton = {
			state: false,
			cellType: null,
			buildingLevel: null,
			mouseDown: false
		},
		coords = {},
		coordsPlaning = {},
		canvas = null,
		buttonsList = {
			build : null,
			remove : null
		},
		objectList = [],
		fieldSize = {
			rowsInMap : 0,
			colInMap : 0
		},
		context = null;


	function SetCanvas(_canvas){
		canvas = _canvas;

		context = canvas.getContext('2d');
	}
	function SetButtonsList(_buttonsList, _type){
		buttonsList[_type] = _buttonsList;
	}
	function GetButtonsList(_type){
		return buttonsList[_type];
	}
	function SetFieldSize(){
		fieldSize.rowsInMap = canvas.height / cellSize;
		fieldSize.colInMap = canvas.width / cellSize;
	}
	function AddEvent(list, eventName, eventHandler) {
		if(list.length)
			for (var i = 0, len = list.length; i < len; i++) {
				(function (index) {
					list[index].addEventListener(eventName, eventHandler, false);
				})(i);
			}
		else
			list.addEventListener(eventName, eventHandler, false);
	}

//<editor-fold desc="Handlers">

	function RemoveButtonClick(ev) {
		ev.preventDefault();

		var cellType = this.getAttribute("data-cellType");

	}

	function BuilderButtonClick(ev) {
		ev.preventDefault();

		coords = {};
		currentButton.state = true;
		currentButton.cellType = this.getAttribute("data-cellType");
		currentButton.buildingLevel = parseInt(this.getAttribute("data-buildingLevel"));
		AddEvent(canvas, "mousedown", BuildInit);
		AddEvent(canvas, "mousemove", SetCoords);
		AddEvent(canvas, "mouseup", Build);
	}

	function BuildInit(ev) {
		ev.preventDefault();
		if (currentButton.state) {
			currentButton.mouseDown = true;
			coords.positionXBegin = Math.floor(ev.offsetX / cellSize);
			coords.positionYBegin = Math.floor(ev.offsetY / cellSize);
			coords.positionXEnd = Math.floor(ev.offsetX / cellSize) + 1;
			coords.positionYEnd = Math.floor(ev.offsetY / cellSize) + 1;
			SetCoordsPlaning();
		}
	}

	function SetCoords(ev){
		if (currentButton.state && currentButton.mouseDown) {
			coords.positionXEnd = Math.floor(ev.offsetX / cellSize) + 1;
			coords.positionYEnd = Math.floor(ev.offsetY / cellSize) + 1;
			SetCoordsPlaning();
			SwapCoordsPlaning();
		}
	}

	function SetCoordsPlaning(){
		coordsPlaning.positionXBegin = coords.positionXBegin;
		coordsPlaning.positionXEnd = coords.positionXEnd;
		coordsPlaning.positionYBegin = coords.positionYBegin;
		coordsPlaning.positionYEnd = coords.positionYEnd;
	}

	function Build(ev) {
		ev.preventDefault();
		if (currentButton.state && currentButton.mouseDown) {
			SwapCoords();
			console.dir(coords);
			if (BuildingMaker.prototype.isEmpty(coords)) {
				var building = BuildingMaker.factory(currentButton.cellType, currentButton.buildingLevel);
				building.save(coords);
			}
			else {
				alert('Sorry, this cell is occupied. Remove contents and add new building');
				console.log('Sorry, this cell is occupied. Remove contents and add new building');
			}
			currentButton.state = false;
			currentButton.mouseDown = false;
			coords = {};
			coordsPlaning = {};
		}
	}

	function SwapCoords(){
		var temp;
		if(coords.positionXBegin > coords.positionXEnd){
			temp = coords.positionXBegin;
			coords.positionXBegin = coords.positionXEnd - 1;
			coords.positionXEnd = temp + 1;
		}
		if(coords.positionYBegin > coords.positionYEnd){
			temp = coords.positionYBegin;
			coords.positionYBegin = coords.positionYEnd - 1;
			coords.positionYEnd = temp + 1;
		}
	}

	function SwapCoordsPlaning(){
		if(coords.positionXBegin > coords.positionXEnd) {
			coordsPlaning.positionXEnd = coords.positionXBegin + 1;
			coordsPlaning.positionXBegin = coords.positionXEnd - 1;
		}
		if(coords.positionYBegin > coords.positionYEnd) {
			coordsPlaning.positionYEnd = coords.positionYBegin + 1;
			coordsPlaning.positionYBegin = coords.positionYEnd - 1;
		}
	}

//</editor-fold>

	function DrawMap() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.beginPath();
		context.fillStyle = "white";
		context.lineWidth = 1;
		context.strokeStyle = "rgba(38,38,38,1)";

		for (var row = 0; row <= fieldSize.rowsInMap; row++) {
			context.moveTo(0, row * cellSize);
			context.lineTo(cellSize * fieldSize.colInMap, row * cellSize);
			context.stroke();
		}
		for (var column = 0; column <= fieldSize.colInMap; column++) {
			context.moveTo(column * cellSize, 0);
			context.lineTo(column * cellSize, cellSize * fieldSize.rowsInMap);
			context.stroke();
		}
		context.closePath();
	}

	function DrawObjects() {
		for (var i = 0, len = objectList.length; i < len; i++) {
			context.fillStyle = BuildingMaker.prototype.cellsInfo[objectList[i].type][objectList[i].lvl].cellColor;
			context.fillRect(objectList[i].coords.positionXBegin * cellSize,
				objectList[i].coords.positionYBegin * cellSize,
				(objectList[i].coords.positionXEnd - objectList[i].coords.positionXBegin) * cellSize,
				(objectList[i].coords.positionYEnd - objectList[i].coords.positionYBegin) * cellSize);
		}
	}

	function DrawBuildPlaning(){
		if (currentButton.state && currentButton.mouseDown) {
			context.fillStyle = 'rgba(192,192,192,0.3)';
			context.fillRect(coordsPlaning.positionXBegin * cellSize,
				coordsPlaning.positionYBegin * cellSize,
				(coordsPlaning.positionXEnd - coordsPlaning.positionXBegin) * cellSize,
				(coordsPlaning.positionYEnd - coordsPlaning.positionYBegin) * cellSize);
		}
	}

// GAME LOOP
	function Draw() {
		var requestAnimationFrame = window.requestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.msRequestAnimationFrame;
		setTimeout(function () {
			requestAnimationFrame(Draw);
			Render();

		}, 1000 / fps);
	}

	function Render() {
		DrawMap();
		DrawObjects();
		DrawBuildPlaning();
	}

	//function CreateMapMask() {
	//	objectList = [];
	//}

	function BuildingMaker() {}
	BuildingMaker.prototype.cellsInfo = {
		'House': {
			1: {
				cellColor: 'rgba(255, 86, 127, 1)'
			},
			2: {
				cellColor: 'rgba(255, 0, 115, 1)'
			},
			3: {
				cellColor: 'rgba(255, 17, 48, 1)'
			}
		},
		'Shop': {
			1: {
				cellColor: 'rgba(55, 86, 127, 1)'
			},
			2: {
				cellColor: 'rgba(55, 0, 115, 1)'
			},
			3: {
				cellColor: 'rgba(55, 17, 48, 1)'
			}
		},
		'Road': {
			1: {
				cellColor: 'rgba(38, 38, 38, 1)'
			}
		}
	};
	BuildingMaker.prototype.getInfo = function() {
		console.log('Prise' + ' is ' + this.getPrise());
	};
	BuildingMaker.prototype.getPrise = function () {
		return this.coeff * 1000 * this.lvl;
	};
	BuildingMaker.prototype.save = function (coords) {
		this.coords = coords;
		objectList.push(this);
		console.dir(objectList);
		//localStorage.mapMask.push(this);
	};
	BuildingMaker.prototype.isEmpty = function (coords) {
		for (var i = 0, len = objectList.length; i < len; i++) {
			//check if planing buildings on existing buildings
			if (
				objectList[i].coords.positionXBegin < coords.positionXEnd &&
				objectList[i].coords.positionXEnd > coords.positionXBegin &&
				objectList[i].coords.positionYEnd > coords.positionYBegin &&
				objectList[i].coords.positionYBegin < coords.positionYEnd
			) {
				return false;
			}
		}
		return true;
	};

	BuildingMaker.factory = function (type, lvl) {
		var constr = type,
			newBuilding;
		if (typeof BuildingMaker[constr] !== 'function') {
			throw {
				name: 'Error',
				message: constr + ' doesn’t exist'
			};
		}
		if (typeof BuildingMaker[constr].prototype.getInfo !== 'function') {
			BuildingMaker[constr].prototype = new BuildingMaker();
		}

		newBuilding = new BuildingMaker[constr](type, lvl);
		return newBuilding;
	};

	BuildingMaker.House = function (type, lvl) {
		this.type = type;
		this.coeff = 0.5;
		this.lvl = lvl;
		this.coords = {
			positionXBegin: 0,
			positionXEnd: 0,
			positionYBegin: 0,
			positionYEnd: 0
		};
	};

	BuildingMaker.Shop = function (type, lvl) {
		this.type = type;
		this.coeff = 0.7;
		this.lvl = lvl;
		this.coords = {
			positionXBegin: 0,
			positionXEnd: 0,
			positionYBegin: 0,
			positionYEnd: 0
		};
	};

	BuildingMaker.Road = function (type, lvl) {
		this.type = type;
		this.coeff = 0.2;
		this.lvl = lvl;
		this.coords = {
			positionXBegin: 0,
			positionXEnd: 0,
			positionYBegin: 0,
			positionYEnd: 0
		};
	};



	return{
		SetCanvas: SetCanvas,
		AddEvent: AddEvent,
		SetButtonsList: SetButtonsList,
		GetButtonsList: GetButtonsList,
		BuilderButtonClick: BuilderButtonClick,
		RemoveButtonClick: RemoveButtonClick,
		SetFieldSize: SetFieldSize,
		Draw: Draw,
		objectList: objectList
	}
})();