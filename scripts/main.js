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
			remove : null,
			clear : null
		},
		objectList = [],
		objectHover = null,
		objectSelect = null,
		fieldSize = {
			rowsInMap : 0,
			colInMap : 0
		},
		temp = {
			object : {},
			coords : {}
		},
		context = null;


	function SetObjectList(){
		if(typeof localStorage['objectList'] != 'undefined'){
			//objectList = JSON.parse(localStorage['objectList']);
		}
		else{
			objectList = [];
		}
	}
	function ClearField(){
		objectList = [];
		//localStorage.removeItem('objectList');
	}
	function SetCanvas(_canvas){
		canvas = _canvas;
		context = canvas.getContext('2d');
	}
	function GetCanvas(){
		return canvas;
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
	function RemoveEvent(list, eventName, eventHandler){
		if(list.length)
			for (var i = 0, len = list.length; i < len; i++) {
				(function (index) {
					list[index].removeEventListener(eventName, eventHandler, false);
				})(i);
			}
		else
			list.removeEventListener(eventName, eventHandler, false);
	}
	function SetCoords(){
		coords.positionXBegin = coordsPlaning.positionXBegin;
		coords.positionXEnd = coordsPlaning.positionXEnd;
		coords.positionYBegin = coordsPlaning.positionYBegin;
		coords.positionYEnd = coordsPlaning.positionYEnd;
	}
	function SwapCoordsPlaning(){
		if(coords.positionXBegin >= coords.positionXEnd) {
			coordsPlaning.positionXEnd = coords.positionXBegin + 1;
			coordsPlaning.positionXBegin = coords.positionXEnd - 1;
		}
		if(coords.positionYBegin >= coords.positionYEnd) {
			coordsPlaning.positionYEnd = coords.positionYBegin + 1;
			coordsPlaning.positionYBegin = coords.positionYEnd - 1;
		}
	}
	function GetCoords(ev){
		coords.positionXBegin = Math.floor(ev.offsetX / cellSize);
		coords.positionYBegin = Math.floor(ev.offsetY / cellSize);
		coords.positionXEnd = Math.floor(ev.offsetX / cellSize) + 1;
		coords.positionYEnd = Math.floor(ev.offsetY / cellSize) + 1;
	}
	function SetCoordsPlaning(){
		coordsPlaning.positionXBegin = coords.positionXBegin;
		coordsPlaning.positionXEnd = coords.positionXEnd;
		coordsPlaning.positionYBegin = coords.positionYBegin;
		coordsPlaning.positionYEnd = coords.positionYEnd;
	}
	function Remove(ev){
		ev.preventDefault();
		if(currentButton.state){
			GetCoords(ev);
			BuildingMaker.prototype.removeObject(BuildingMaker.prototype.getObject('All', coords).type, coords);

			currentButton.state = false;
			RemoveEvent(canvas, "click", Remove);
		}
	}
	function BuildPlaningRoad(){
		//create road with width = 1 cell;
		if(currentButton.cellType == 'Road') {
			var xLength = coords.positionXEnd - coords.positionXBegin;
			var yLength = coords.positionYEnd - coords.positionYBegin;
			var isNegative = {
				x: false,
				y: false
			};
			isNegative.x = xLength < 0;
			isNegative.y = yLength < 0;
			if(!isNegative.x && !isNegative.y ||
				isNegative.x && isNegative.y) {
				if ((yLength / xLength) < Math.PI / 4) {
					coords.positionYEnd = coords.positionYBegin + 1;
				}
				else {
					coords.positionXEnd = coords.positionXBegin + 1;
					console.log('1. coords', coords);
				}
			}
			else if(isNegative.x || isNegative.y){
				if (-(yLength / xLength) < Math.PI / 4) {
					coords.positionYEnd = coords.positionYBegin + 1;
				}
				else {
					coords.positionXEnd = coords.positionXBegin + 1;
					console.log('2. coords', coords);
				}
			}
		}
	}

	function BuildRoad(){
		var width = coords.positionXEnd - coords.positionXBegin;
		var height = coords.positionYEnd - coords.positionYBegin;
		temp.coords.positionXBegin = coords.positionXBegin;
		temp.coords.positionXEnd = coords.positionXEnd;
		temp.coords.positionYBegin = coords.positionYBegin;
		temp.coords.positionYEnd = coords.positionYEnd;


		for (var i = 0, len = width == 1? height: width; i < len; i++) {
			building = BuildingMaker.factory(currentButton.cellType, currentButton.buildingLevel);

			if(width > height){
				temp.coords.positionXBegin = coords.positionXBegin + i;
				temp.coords.positionXEnd = coords.positionXBegin + i + 1;

				if(i!=0 && i!=(len-1)){
					building.mount.left = building.addMount('Road', 'left', temp.coords);
					building.mount.right = building.addMount('Road', 'right', temp.coords);
				}
				else if(i==0){
					building.mount.right = building.addMount('Road', 'right', temp.coords);
				}
				else{
					building.mount.left = building.addMount('Road', 'left', temp.coords);
				}
			}
			else if(width < height){
				temp.coords.positionYBegin = coords.positionYBegin + i;
				temp.coords.positionYEnd = coords.positionYBegin + i + 1;


				if(i!=0 && i!=(len-1)){
					building.mount.top = building.addMount('Road', 'top', temp.coords);
					building.mount.bottom = building.addMount('Road', 'bottom', temp.coords);
				}
				else if(i==0){
					building.mount.bottom = building.addMount('Road', 'bottom', temp.coords);
				}
				else{
					building.mount.top = building.addMount('Road', 'top', temp.coords);
				}
			}

			building.mount.right = building.addMount('Road', 'right', temp.coords);
			if (!!building.mount.right) {
				building.mount.right.mount.left = building;
			}
			building.mount.left = building.addMount('Road', 'left', temp.coords);
			if (!!building.mount.left) {
				building.mount.left.mount.right = building;
			}
			building.mount.top = building.addMount('Road', 'top', temp.coords);
			if (!!building.mount.top) {
				building.mount.top.mount.bottom = building;
			}
			building.mount.bottom = building.addMount('Road', 'bottom', temp.coords);
			if (!!building.mount.bottom) {
				building.mount.bottom.mount.top = building;
			}

			building.save({
				positionXBegin: temp.coords.positionXBegin,
				positionXEnd: temp.coords.positionXEnd,
				positionYBegin: temp.coords.positionYBegin,
				positionYEnd: temp.coords.positionYEnd
			});
		}

		width = null;
		height = null;
	}

//<editor-fold desc="Handlers">

	function RemoveButtonClick(ev) {
		ev.preventDefault();

		coords = {};
		currentButton.state = true;
		currentButton.cellType = this.getAttribute("data-cellType");
		AddEvent(canvas, "click", Remove);

	}
	function BuilderButtonClick(ev) {
		ev.preventDefault();
		coords = {};
		currentButton.state = true;
		currentButton.cellType = this.getAttribute("data-cellType");
		currentButton.buildingLevel = parseInt(this.getAttribute("data-buildingLevel"));
		AddEvent(canvas, "mousedown", BuildInit);
		AddEvent(canvas, "mousemove", BuildPlaning);
		AddEvent(canvas, "mouseup", Build);
	}
	function BuildInit(ev) {
		ev.preventDefault();
		if (currentButton.state) {
			currentButton.mouseDown = true;
			GetCoords(ev);
			SetCoordsPlaning();
		}
	}
	function BuildPlaning(ev){
		if (currentButton.state && currentButton.mouseDown) {
			coords.positionXEnd = Math.floor(ev.offsetX / cellSize) + 1;
			coords.positionYEnd = Math.floor(ev.offsetY / cellSize) + 1;

			console.log(coords.positionXEnd, coords.positionYEnd);


			BuildPlaningRoad();



			SetCoordsPlaning();
			SwapCoordsPlaning();
		}
	}
	function Build(ev) {
		ev.preventDefault();
		if (currentButton.state && currentButton.mouseDown) {
			SetCoords();
			if (BuildingMaker.prototype.isEmpty(coords)) {
				var building;
				if(currentButton.cellType != 'Road'){
					building = BuildingMaker.factory(currentButton.cellType, currentButton.buildingLevel);
					building.save(coords);
				}
				else{
					BuildRoad();
				}
			}
			else {
				alert('Sorry, this cell is occupied. Remove contents and add new building');
				console.log('Sorry, this cell is occupied. Remove contents and add new building');
			}
			currentButton.state = false;
			currentButton.cellType = null;
			currentButton.buildingLevel = null;
			currentButton.mouseDown = false;
			coords = {};
			coordsPlaning = {};
			RemoveEvent(canvas, "mousedown", BuildInit);
			RemoveEvent(canvas, "mousemove", BuildPlaning);
			RemoveEvent(canvas, "mouseup", Build);
		}
	}
	function BuildingPreSelect(ev){
		ev.preventDefault();
		if (!currentButton.state && !currentButton.mouseDown) {
			GetCoords(ev);
			var objectTemp = objectHover;
			objectHover = BuildingMaker.prototype.getObject('All', coords);
			if(objectHover != null && objectHover != objectTemp) {
				//later this will be in a table-info
				//console.log(objectHover);
			}
		}
	}
	function BuildingSelect(ev){
		ev.preventDefault();
		if (!currentButton.state && !currentButton.mouseDown) {
			GetCoords(ev);
			objectSelect = BuildingMaker.prototype.getObject('All', coords);
			if(!!objectSelect) {
				//later this will be in a table-info
				console.log(objectSelect);
			}
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

	function DrawPreSelect(){
		if (!!objectHover && objectHover != objectSelect ) {
			var coords = objectHover.coords;
			context.fillStyle = 'rgba(192,192,192,0.3)';
			context.fillRect(coords.positionXBegin * cellSize,
				coords.positionYBegin * cellSize,
				(coords.positionXEnd - coords.positionXBegin) * cellSize,
				(coords.positionYEnd - coords.positionYBegin) * cellSize);
		}
	}
	function DrawSelect(){
		if (!!objectSelect) {
			var coords = objectSelect.coords;
			context.fillStyle = 'rgba(192,192,192,0.3)';
			context.fillRect(coords.positionXBegin * cellSize,
				coords.positionYBegin * cellSize,
				(coords.positionXEnd - coords.positionXBegin) * cellSize,
				(coords.positionYEnd - coords.positionYBegin) * cellSize);
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
		DrawPreSelect();
		DrawSelect();
	}

	//function CreateMapMask() {
	//	objectList = [];
	//}

	function removeMount(object) {
		if(object.mount.bottom !== null){
			object.mount.bottom.mount.up = null;
			object.mount.bottom = null;
		}
		if(object.mount.top !== null){
			object.mount.top.mount.bottom = null;
			object.mount.top = null;
		}
		if(object.mount.left !== null){
			object.mount.left.mount.right = null;
			object.mount.left = null;
		}
		if(object.mount.right !== null){
			object.mount.right.mount.left = null;
			object.mount.right = null;
		}
	}

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
		//localStorage['objectList'] = JSON.stringify(objectList);
	};
	BuildingMaker.prototype.getObject = function (type, coords) {
		for (var i = 0, len = objectList.length; i < len; i++) {
			if(objectList[i].type == type ||  type == 'All') {
				if (
					objectList[i].coords.positionXBegin < coords.positionXEnd &&
					objectList[i].coords.positionXEnd > coords.positionXBegin &&
					objectList[i].coords.positionYEnd > coords.positionYBegin &&
					objectList[i].coords.positionYBegin < coords.positionYEnd
				) {
					return objectList[i];
				}
			}
		}
		return null;
	};
	BuildingMaker.prototype.removeObject = function(type, coords){
		for (var i = 0, len = objectList.length; i < len; i++) {
			if(objectList[i].type == type ||  type == 'All') {
				if (
					objectList[i].coords.positionXBegin < coords.positionXEnd &&
					objectList[i].coords.positionXEnd > coords.positionXBegin &&
					objectList[i].coords.positionYEnd > coords.positionYBegin &&
					objectList[i].coords.positionYBegin < coords.positionYEnd
				) {
					if(type == 'Road'){
						removeMount(objectList[i]);
					}
					objectList.splice(i, 1);
					return true;
				}
			}
		}
		return false;
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
	//BuildingMaker.prototype.isRoad = function(coords){
	//	temp.object = BuildingMaker.prototype.getObject('Road', coords);
	//};
	BuildingMaker.prototype.addMount = function(type, place, coords){
		temp.object = BuildingMaker.prototype.getObject(type, coords);
		var x = 0,
			y = 0;

		if(!temp.object){
			switch (place) {
				case 'left':
				{
					x = -1;
					break;
				}
				case 'right':
				{
					x = 1;
					break;
				}
				case 'top':
				{
					y = -1;
					break;
				}
				case 'bottom':
				{
					y = 1;
					break;
				}
			}

			return BuildingMaker.prototype.getObject(type, {
				positionXBegin: coords.positionXBegin + x,
				positionXEnd: coords.positionXEnd + x,
				positionYBegin: coords.positionYBegin + y,
				positionYEnd: coords.positionYEnd + y
			});
		}

		temp.object = {};
		temp.coords = {};
		return null;
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

		this.mount = {
			top: null,
			right: null,
			bottom: null,
			left: null
		};

		this.coords = {
			positionXBegin: 0,
			positionXEnd: 0,
			positionYBegin: 0,
			positionYEnd: 0
		};
	};



	return{
		SetCanvas: SetCanvas,
		GetCanvas: GetCanvas,
		AddEvent: AddEvent,
		SetButtonsList: SetButtonsList,
		GetButtonsList: GetButtonsList,
		BuilderButtonClick: BuilderButtonClick,
		RemoveButtonClick: RemoveButtonClick,
		SetFieldSize: SetFieldSize,
		Draw: Draw,
		BuildingPreSelect: BuildingPreSelect,
		BuildingSelect: BuildingSelect,
		SetObjectList: SetObjectList,
		ClearField: ClearField,
		objectList: objectList
	}
})();