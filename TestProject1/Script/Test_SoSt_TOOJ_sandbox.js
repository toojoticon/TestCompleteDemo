var ViewWelcomeScreen = Aliases.SoundStudio.WelcomeScreen;
var ViewMainWindow = Aliases.SoundStudio.MainWindow;
var Auto = Lib_Automation;

function Test2() {
  var SoundLibrary = Aliases.SoundStudio.MainWindow.SceneTabControl.SoundLibraryContainer.SoundLibrary;
  var items = SoundLibrary.Items;
  var count = items.Count;
  
  for (var c=0; c<count; c++) {
    var item = items.GetItemAt(c);
    
    var subitem = item.GetItemAt(0);
    Log.Message(subitem.Content);
  }  

}