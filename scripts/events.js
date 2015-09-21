window.onload = function() {

	//Control buttons (create)
	BCL.SetButtonsList(document.getElementsByClassName("buildersButtons"), 'build');
	BCL.AddEvent(BCL.GetButtonsList('build'), "click", BCL.BuilderButtonClick);

	//Control buttons (remove)
	BCL.SetButtonsList(document.getElementsByClassName("removeButton"), 'remove');
	BCL.AddEvent(BCL.GetButtonsList('remove'), "click", BCL.RemoveButtonClick);

	//Canvas
	BCL.SetCanvas(document.getElementById("MainWindow"));
	BCL.SetFieldSize();

	//start!
	BCL.Draw();
};

