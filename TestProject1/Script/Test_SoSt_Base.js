/**
Author: TOOJ
Date created: 2016-09-20 
Description: 
Base tests for Sound Studio.

*/

//USEUNIT Lib_Automation
//USEUNIT Lib_SoSt_General

var ViewWelcomeScreen = Aliases.SoundStudio.WelcomeScreen;
var ViewMainWindow = Aliases.SoundStudio.MainWindow;

function Test1() {
  StartSoundStudio();
  AutomationLibrary.Click(ViewWelcomeScreen.ButtonLaunchSoundStudio, "Launch Sound Studio");
  AutomationLibrary.ClickIfExists(ViewMainWindow.ButtonNo, "Button No (import sounds)");
    
  AutomationLibrary.Click(ViewMainWindow.ButtonAddSound, "Add Sounds Button");
  
  AutomationLibrary.CheckIfExists(ViewMainWindow.ButtonChooseFiles, "Button Choose Files");
    
  AutomationLibrary.Click(ViewMainWindow.ButtonAddScene, "Compose New Scene Button");
  var Scene = ViewMainWindow.SceneTabControl.Scene;

  AutomationLibrary.CheckIfExists(Scene, "Scene");
  
  var SoundLibrary = Aliases.SoundStudio.MainWindow.SceneTabControl.SoundLibraryContainer;
  SoundLibrary.ItemsControl.ContentPresenter.Click();
  
  var GlassBreaking = Aliases.SoundStudio.MainWindow.SceneTabControl.SoundLibraryContainer.SoundList.GlassBreaking;
  
  var SoundItem = Aliases.SoundStudio.MainWindow.SceneTabControl.SoundLibraryContainer.SoundList.SoundItem
  AutomationLibrary.Click(SoundItem, "Item Sound");
  SoundItem.HoverMouse();
  SoundItem.DblClick();

  AutomationLibrary.ClickIfExists(ViewMainWindow.ButtonCalibrateLater, "Button Calibrate Later");
  
  AutomationLibrary.Click(ViewMainWindow.Border.ButtonPlay, "Play Button");
  AutomationLibrary.CheckIfExists(ViewMainWindow.TimeIndicator, "Time indicator");
  var text = ViewMainWindow.TimeIndicator.Text;
  Log.Message("Text is: " + text);
  
  //CloseSoundStudio();
}

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

