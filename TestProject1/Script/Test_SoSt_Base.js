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
var Auto = Lib_Automation;

function Test_SoSt_BaseCheck() {
  StartSoundStudio();
  
  Auto.ClickIfExists(ViewWelcomeScreen.ButtonLaunchSoundStudio, "Launch Sound Studio");
  Auto.ClickIfExists(ViewMainWindow.ButtonNo, "Button No (import sounds)");
    
  Auto.Click(ViewMainWindow.ButtonAddSound, "Add Sounds Button");
  
  Auto.CheckIfExists(ViewMainWindow.ButtonChooseFiles, "Button Choose Files");
    
  Auto.Click(ViewMainWindow.ButtonAddScene, "Compose New Scene Button");
  var Scene = ViewMainWindow.SceneTabControl.Scene;

  Auto.CheckIfExists(Scene, "Scene");
  
  var SoundLibrary = Aliases.SoundStudio.MainWindow.SceneTabControl.SoundLibraryContainer;
  SoundLibrary.ItemsControl.ContentPresenter.Click();
  
  var GlassBreaking = Aliases.SoundStudio.MainWindow.SceneTabControl.SoundLibraryContainer.SoundList.GlassBreaking;
  
  var SoundItem = Aliases.SoundStudio.MainWindow.SceneTabControl.SoundLibraryContainer.SoundList.SoundItem
  Auto.Click(SoundItem, "Item Sound");
  SoundItem.HoverMouse();
  SoundItem.DblClick();

  Auto.ClickIfExists(ViewMainWindow.ButtonCalibrateLater, "Button Calibrate Later");
  
  Auto.Click(ViewMainWindow.Border.ButtonPlay, "Play Button");
  Auto.CheckIfExists(ViewMainWindow.TimeIndicator, "Time indicator");
  var text = ViewMainWindow.TimeIndicator.Text;
  Log.Message("Text is: " + text);

  //Create new scene (check if SoundStudio is not hanged)
  Auto.Click(ViewMainWindow.ButtonAddScene, "Compose New Scene Button");
  Auto.CheckIfExists(Scene, "Scene");
  
  //CloseSoundStudio();
}



