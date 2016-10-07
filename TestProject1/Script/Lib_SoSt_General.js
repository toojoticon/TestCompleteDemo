/**
Author: 
Date created: 
Description: 
Library with general functions for Sound Studio platform.

*/

//USEUNIT Lib_Automation

function StartSoundStudio() {
  Lib_Automation.killProcess("SoundStudio");
   
  /** Command line parameter change **/
  TestedApps.SoundStudio.Params.ActiveParams.CommandLineParameters = "-m geniegenesis";

  Log.AppendFolder("Start Sound Studio");
  TestedApps.SoundStudio.Run();
  Log.PopLogFolder();
  //Aliases.SoundStudio.Maximize();
  
}

function CloseSoundStudio() {
  //Stop execution immediately
  //Log.Error("Now closing!");
  //Runner.Stop();
  Log.AppendFolder("Closing Sound Studio");
  TestedApps.SoundStudio.Close();
  Log.PopLogFolder();
}