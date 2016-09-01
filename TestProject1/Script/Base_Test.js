//USEUNIT AutomationLibrary
//USEUNIT SoSt_General
//This my changed comment to Git - Sebastian
var ViewWelcomeScreen = Aliases.SoundStudio.WelcomeScreen;
var ViewMainWindow = Aliases.SoundStudio.MainWindow;

function Test1() {
  StartSoundStudio();
  AutomationLibrary.Click(ViewWelcomeScreen.ButtonLaunchSoundStudio, "Click Launch Sound Studio");
  AutomationLibrary.Click(ViewMainWindow.ButtonAddSound, "Click Add Sounds Button");
  
  //Check if button "Choose files" is available
  var ChooseFiles = ViewMainWindow.ButtonChooseFiles;
  aqObject.CheckProperty(ChooseFiles, "Exists", cmpEqual, true)
  
  CloseSoundStudio();
}

