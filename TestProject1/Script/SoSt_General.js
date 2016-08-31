//USEUNIT AutomationLibrary

function StartSoundStudio() {
  AutomationLibrary.killProcess("SoundStudio");
   
  /** Command line parameter change **/
  TestedApps.SoundStudio.Params.ActiveParams.CommandLineParameters = "-m geniegenesis";

  Log.AppendFolder("Start Sound Studio");
  TestedApps.SoundStudio.Run();
  Log.PopLogFolder();
}

function CloseSoundStudio() {
  //Stop execution immediately
  //Log.Error("Now closing!");
  //Runner.Stop();
  Log.AppendFolder("Closing Sound Studio");
  TestedApps.SoundStudio.Close();
  Log.PopLogFolder();
}