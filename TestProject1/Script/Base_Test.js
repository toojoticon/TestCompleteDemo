//USEUNIT AutomationLibrary

function external() {
  Log.Message("External function called");
}

function Test1() {
  
  killProcess("SoundStudio");
  // Call external function
  Runner.CallMethod("Base_Test.external");
    
  /** Command line parameter change **/
  TestedApps.SoundStudio.Params.ActiveParams.CommandLineParameters = "-m geniegenesis";

  Log.CreateFolder("My Folder");
  Log.AppendFolder("My Folder", "Nested message");
    
  Log.Message("Start Sound Studio");
  
  TestedApps.SoundStudio.Run();
  var buttonLaunch = Aliases.SoundStudio.WelcomeScreen.ButtonLaunchSoundStudio;
  buttonLaunch.Click();

  //Click Add Sounds Button
  var MenuAddSound = Aliases.SoundStudio.MainWindow.ButtonAddSound;
  MenuAddSound.Click();
  
  //Check if button "Choose files" is available
  var ChooseFiles = Aliases.SoundStudio.MainWindow.ButtonChooseFiles;
  aqObject.CheckProperty(ChooseFiles, "Exists", cmpEqual, true)

  Log.PopLogFolder();
  
  //Stop execution immediately
  //Log.Error("Now closing!");
  //Runner.Stop();
  Log.Picture(Sys.Desktop.ActiveWindow(), "Screenshot1");
  
  TestedApps.SoundStudio.Close();
}

