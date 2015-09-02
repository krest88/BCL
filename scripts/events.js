
BCL.AddEvent = function (list, eventName, eventHandler){
	for(var i = 0, len = list.length; i < len; i++){
		(function(index){
			list[index].addEventListener(eventName, eventHandler, false);
		})(i);
	}
};



//<editor-fold desc="Handlers">

BCL.BuilderButtonClick = function (ev) {
	ev.preventDefault();


	BCL.currentButton.state = true;
	BCL.currentButton.cellType = this.getAttribute("data-cellType");
	BCL.currentButton.buildingLevel = parseInt(this.getAttribute("data-buildingLevel"));

	BCL.AddEvent(BCL.canvas, "click", BCL.Build);
	//BCL.AddEvent(BCL.canvas, "onmouseover", BCL.BuildPlaning);
	//BCL.AddEvent(BCL.canvas, "onmousedown", BCL.Build);
};

BCL.RemoveButtonClick = function (ev) {
	ev.preventDefault();

	var cellType = this.getAttribute("data-cellType");


};

BCL.Build = function(ev){
	ev.preventDefault();

	if(BCL.currentButton.state){
		var positionXBegin = Math.floor(ev.offsetX/BCL.cellSize);
		var positionYBegin = Math.floor(ev.offsetY/BCL.cellSize);
		var building = BCL.BuildingMaker.factory(BCL.currentButton.cellType, BCL.currentButton.buildingLevel);
		building.save({
			positionXBegin : positionXBegin,
			positionYBegin: positionYBegin,
			positionXEnd : positionXBegin,
			positionYEnd: positionYBegin}
		);
		building.getInfo();

	}
};

BCL.BuildPlaning = function(ev){
	ev.preventDefault();

	if(BCL.currentButton.state){

		BCL.context.fillStyle = BCL.cellsInfo[BCL.currentButton.cellType][BCL.currentButton.buildingLevel].cellColor;

		BCL.context.fillRect(Math.floor(ev.offsetX/BCL.cellSize)*BCL.cellSize,
			Math.floor(ev.offsetY/BCL.cellSize)*BCL.cellSize,
			BCL.cellSize, BCL.cellSize);

	}

};
//</editor-fold>




window.onload = function() {

	//Control buttons (create)
	BCL.buildersButtonsList = document.getElementsByClassName("buildersButtons");
	BCL.AddEvent(BCL.buildersButtonsList, "click", BCL.BuilderButtonClick);


	//Control buttons (remove)
	BCL.removeButtonsList = document.getElementsByClassName("removeButton");
	BCL.AddEvent(BCL.removeButtonsList, "click", BCL.RemoveButtonClick);

	//Canvas
	BCL.canvas = document.getElementsByTagName("canvas");
	//BCL.AddEvent(BCL.canvas, "click", BCL.CanvasClick);
	BCL.rowsInMap = BCL.canvas[0].height / BCL.cellSize;
	BCL.colInMap = BCL.canvas[0].width / BCL.cellSize;
	BCL.mapMask = BCL.CreateMapMask(); //|| localStorage.mapMask;

	BCL.context = BCL.canvas[0].getContext('2d');
	//BCL.DrawBox(BCL.context);

	BCL.Draw();
};

