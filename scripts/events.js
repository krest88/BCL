window.onload = function() {

	//Canvas
	BCL.SetCanvas(document.getElementById("MainWindow"));
	BCL.SetFieldSize();

	//Control buttons (create)
	BCL.SetButtonsList(document.getElementsByClassName("buildersButtons"), 'build');
	BCL.AddEvent(BCL.GetButtonsList('build'), "click", BCL.BuilderButtonClick);
	BCL.AddEvent(BCL.GetCanvas(), "mousemove", BCL.BuildingPreSelect);
	BCL.AddEvent(BCL.GetCanvas(), "click", BCL.BuildingSelect);

	//Control buttons (remove)
	BCL.SetButtonsList(document.getElementsByClassName("removeButton"), 'remove');
	BCL.AddEvent(BCL.GetButtonsList('remove'), "click", BCL.RemoveButtonClick);


	//start!
	BCL.Draw();
};

