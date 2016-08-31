var unitName = "TcUtil.";
var TestedApp;

//------ Delay10sec() ---------------------------------------------------------------------------------------------------------------------------//
function Delay10sec()
{
  Log.Message(unitName + "Delay 10 seconds");
  Delay(10000);
}

//------ Delay1sec() ---------------------------------------------------------------------------------------------------------------------------//
function Delay1sec()
{
  Log.Message(unitName + "Delay one second");
  Delay(1000);
}

//------ Delay3sec() ---------------------------------------------------------------------------------------------------------------------------//
function Delay3sec()
{
  Log.Message(unitName + "Delay 3 seconds");
  Delay(3000);
}

//------ UpdateTfsBuildPage() ---------------------------------------------------------------------------------------------------------------------------//
function UpdateTfsBuildPage()
{
  Log.AppendFolder(unitName + "UpdateTfsBuildPage");
  // \\kbnntswd02\Build\DropPhoenix\_FSI.GenieComp.Dev01.00_PubImpl_1.0.252-alpha0000.149183.1
  Project.Variables.BuildServerDropFolder = BuiltIn.InputBox("BuildServerDropFolder", "Paste path of drop folder from  build server:",
                                                       "yes paste here");
  Log.Message("BuildServerDropFolder: " + Project.Variables.BuildServerDropFolder);
  
  TestedApps.TfsBuildQualityEditor.Run();
  Aliases.TfsBuildQualityEditor.DropFolder.Text = Project.Variables.BuildServerDropFolder;
  Aliases.TfsBuildQualityEditor.DropFolder.Keys("[Enter]");
  Aliases.TfsBuildQualityEditor.UpdateBuildPage.Click();
  Delay(5000);
  Aliases.TfsBuildQualityEditor.UpdateCompleteOK.Click();
  Aliases.TfsBuildQualityEditor.Close();
  Log.PopLogFolder();
}

//------ InstallNewBuild() ---------------------------------------------------------------------------------------------------------------------------//
function InstallNewBuild()
{
  Log.AppendFolder(unitName + "InstallNewBuild");
  _GetInstallerPathInfo();
  LogSWUTInfo();
  _InstallBuild();
  Log.PopLogFolder();
}

//------ ResetStatusFlags() ---------------------------------------------------------------------------------------------------------------------------//
function ResetStatusFlags()
{
  Log.AppendFolder(unitName + "ResetStatusFlags");

  ResetNewSelectionFlag();
  ResetSessionChangedFlag();
  ResetHILeftFlag();
  ResetHIRightFlag();

  Log.PopLogFolder();
}

//------ ResetStandaloneFlag() ---------------------------------------------------------------------------------------------------------------------------//
function ResetStandaloneFlag()
{
  Log.Message(unitName + "ResetStandaloneFlag");
  Project.Variables.bStandalone = false;
}

//------ SetStandaloneFlag() ---------------------------------------------------------------------------------------------------------------------------//
function SetStandaloneFlag()
{
  Log.Message(unitName + "SetStandaloneFlag");
  Project.Variables.bStandalone = true;
}

//------ ResetNewSelectionFlag() ---------------------------------------------------------------------------------------------------------------------------//
function ResetNewSelectionFlag()
{
  Log.Message(unitName + "ResetNewSelectionFlag");
  Project.Variables.bNewSelection = false;
}

//------ SetNewSelectionFlag() ---------------------------------------------------------------------------------------------------------------------------//
function SetNewSelectionFlag()
{
  Log.Message(unitName + "SetNewSelectionFlag");
  Project.Variables.bNewSelection = true;
}

//------ ResetStrictFlowFlag() ---------------------------------------------------------------------------------------------------------------------------//
function ResetStrictFlowFlag()
{
  Log.Message(unitName + "ResetStrictFlowFlag");
  Project.Variables.bStrictFlow = false;
}

//------ SetStrictFlowFlag() ---------------------------------------------------------------------------------------------------------------------------//
function SetStrictFlowFlag()
{
  Log.Message(unitName + "SetStrictFlowFlag");
  Project.Variables.bStrictFlow = true;
}

//------ ResetSessionChangedFlag() ---------------------------------------------------------------------------------------------------------------------------//
function ResetSessionChangedFlag()
{
  Log.Message(unitName + "ResetSessionChangedFlag");
  Project.Variables.bSessionChanged = false;
}

//------ SetSessionChangedFlag() ---------------------------------------------------------------------------------------------------------------------------//
function SetSessionChangedFlag()
{
  Log.Message(unitName + "SetSessionChangedFlag");
  Project.Variables.bSessionChanged = true;
}

//------ ResetHILeftFlag() ---------------------------------------------------------------------------------------------------------------------------//
function ResetHILeftFlag()
{
  Log.Message(unitName + "ResetHILeftFlag");
  Project.Variables.bHiLeft = false;
}

//------ SetHILeftFlag() ---------------------------------------------------------------------------------------------------------------------------//
function SetHILeftFlag()
{
  Log.Message(unitName + "SetHILeftFlag");
  Project.Variables.bHiLeft = true;
}

//------ ResetHIRightFlag() ---------------------------------------------------------------------------------------------------------------------------//
function ResetHIRightFlag()
{
  Log.Message(unitName + "ResetHIRightFlag");
  Project.Variables.bHiRight = false;
}

//------ SetHIRightFlag() ---------------------------------------------------------------------------------------------------------------------------//
function SetHIRightFlag()
{
  Log.Message(unitName + "SetHIRightFlag");
  Project.Variables.bHiRight = true;
}

//------ ResetSTPFlag() ---------------------------------------------------------------------------------------------------------------------------//
function ResetSTPFlag()
{
  Log.Message(unitName + "ResetSTPFlag");
  Project.Variables.bSTP = false;
}

//------ SetSTPFlag() ---------------------------------------------------------------------------------------------------------------------------//
function SetSTPFlag()
{
  Log.Message(unitName + "SetSTPFlag");
  Project.Variables.bSTP = true;
}

//------ ResetPositiveTestOnlyFlag() ---------------------------------------------------------------------------------------------------------------------------//
function ResetPositiveTestOnlyFlag()
{
  Log.Message(unitName + "ResetPositiveTestOnlyFlag");
  Project.Variables.bPositiveTestOnly = false;
}

//------ SetPositiveTestOnlyFlag() ---------------------------------------------------------------------------------------------------------------------------//
function SetPositiveTestOnlyFlag()
{
  Log.Message(unitName + "SetPositiveTestOnlyFlag");
  Project.Variables.bPositiveTestOnly = true;
}

//------ LogNegativeCheckSkipped() ---------------------------------------------------------------------------------------------------------------------------//
function LogNegativeCheckSkipped()
{
    Log.Message("Negative check skipped");
}

//------ LogSWUTInfo() ---------------------------------------------------------------------------------------------------------------------------//
function LogSWUTInfo()
{
  Log.AppendFolder(unitName + "LogSWUTInfo");
  Log.Message("MirroredInstallerFullPathExe: " + Project.Variables.MirroredInstallerFullPathExe);
  Log.Message("Installer: " + Project.Variables.Installer);
  Log.Message("InstallerDestinationPath: " + Project.Variables.InstallerDestinationPath);
  Log.Message("InstallerName: " + Project.Variables.InstallerName);
  Log.Message("CompositionPath: " + Project.Variables.CompositionPath);
  Log.Message("SWUT: " + Project.Variables.SWUT);
  Log.Message("Automated check running as " + Sys.UserName + " on " + Sys.HostName);
  Log.PopLogFolder();
}

//------ _GetInstallerPathInfo() ---------------------------------------------------------------------------------------------------------------------------//
function _GetInstallerPathInfo()
{
  Log.AppendFolder(unitName + "_GetInstallerPathInfo");
  // "\\demant.com\data\KBN\RnD\FS\DevResults\Phoenix\Dev_16.1\GenieComposition\Phoenix.GenieComposition.1.0.252-alpha0000\Phoenix.GenieComposition.1.0.252-alpha0000.exe"
  Project.Variables.MirroredInstallerFullPathExe = BuiltIn.InputBox("MirroredInstallerFullPathExe", "Paste full path of exe to install fom mirrored server:",
                                                       "yes paste here");
                                                       
  Log.Message("MirroredInstallerFullPathExe: " + Project.Variables.MirroredInstallerFullPathExe);
  
  Project.Variables.Installer = aqString.Replace(Project.Variables.MirroredInstallerFullPathExe, "\"", ""); // Used in TestedApps.Installer
  Project.Variables.Installer = aqString.Replace(Project.Variables.Installer, ".exe", "");
  
  // find last \ starting at the end
  var idx = 0;
  var ch = "";
  for (i = aqString.GetLength(Project.Variables.Installer) -1; i > 0; i--)
  {
    ch = aqString.GetChar(Project.Variables.Installer, i);
    
    if (ch == "\\")
    { 
       idx = i;
       break;
     }
  }

  if (idx == 0) { Runner.Halt("Invalid Project.Variables.Installer"); }
  
  // Extract from the only one source string:
  Project.Variables.InstallerName = Project.Variables.Installer.substr(idx + 1);
  Project.Variables.CompositionPath = Project.Variables.InstallerDestinationPath + Project.Variables.InstallerName + "\\";
  Project.Variables.SWUT = Project.Variables.CompositionPath + Project.Variables.CompositionProcessName + ".exe";
  Log.PopLogFolder();
}

//------ _InstallBuild() ---------------------------------------------------------------------------------------------------------------------------//
function _InstallBuild()
{
  Log.AppendFolder(unitName + "_InstallBuild");
  TestedApps.Installer.Run();
  Aliases.Installer7Zip.Destination.wText = Project.Variables.InstallerDestinationPath;
  Aliases.Installer7Zip.Extract.Click();
  Delay(10000);
  
  Log.PopLogFolder();
}

//------ RegisterInNoah() ---------------------------------------------------------------------------------------------------------------------------//
function RegisterInNoah()
{
  Log.AppendFolder(unitName + "RegisterInNoah");
  
//  Project.Variables.CompositionPath = BuiltIn.InputBox("Project.Variables.CompositionPath",
//                                                       "Please update this path if necessary...",
//                                                       Project.Variables.CompositionPath);
  TestedApps.RegisterNoah.Run();
  Aliases.RegisterNoah.WaitProperty("Exists", true);
  Aliases.RegisterNoah.Executable.Text = "";
  Aliases.RegisterNoah.Executable.Text = TestedApp.FullFileName;
  Aliases.RegisterNoah.Executable.Keys("[Enter]");
  Aliases.RegisterNoah.ModuleName.Text = "";
  Aliases.RegisterNoah.ModuleName.Text = TestedApp.ItemName;
  Aliases.RegisterNoah.ModuleName.Keys("[Enter]");
  Aliases.RegisterNoah.ManufacturerID.ClickItem(Project.Variables.ManufacturerID);
  Aliases.RegisterNoah.ManufacturerModuleID.ClickItem(Project.Variables.ManufacturerModuleID);
  aqObject.CheckProperty(Aliases.RegisterNoah.RegisterInNoah4, "Enabled", cmpEqual, true);
  Aliases.RegisterNoah.RegisterInNoah4.Click();
  Delay(2000);
  Aliases.RegisterNoah.Close();  
    
  Log.PopLogFolder();
}

//------ UnRegisterInNoah() ---------------------------------------------------------------------------------------------------------------------------//
function UnRegisterInNoah()
{
  Log.AppendFolder(unitName + "UnRegisterInNoah");
  
  TestedApps.RegisterNoah.Run();
  Aliases.RegisterNoah.WaitProperty("Exists", true);
  Aliases.RegisterNoah.ManufacturerID.ClickItem(Project.Variables.ManufacturerID);
  Aliases.RegisterNoah.ManufacturerModuleID.ClickItem(Project.Variables.ManufacturerModuleID);
  aqObject.CheckProperty(Aliases.RegisterNoah.UnregisterInNoah4, "Enabled", cmpEqual, true);
  Aliases.RegisterNoah.UnregisterInNoah4.Click();
  Delay(2000);
  Aliases.RegisterNoah.Close();  
    
  Log.PopLogFolder();
}

//------ ListCommands() ---------------------------------------------------------------------------------------------------------------------------//
function ListCommands(View)
{
  Log.AppendFolder(unitName + "ListCommands");
  
  var commands =  View.DataContext.Commands;
  var nListCommands = 0;
  for (nListCommands = 0; nListCommands < commands.Count; nListCommands++)
  {
    Log.Message("n = " + nListCommands + ": '" + commands.Item(nListCommands).Id + "'");  
  }

  Log.PopLogFolder();
}

//------ _FindCommandById() ---------------------------------------------------------------------------------------------------------------------------//
function _FindCommandById(View, CommandId)
{
  Log.AppendFolder(unitName + "_FindCommandById = " + View.Name + " - '" + CommandId + "'");
  var commands =  View.DataContext.Commands;
  var nFindCommands = 0;
  
  for (nFindCommands = 0; nFindCommands < commands.Count; nFindCommands++)
  {
    if (commands.Item(nFindCommands).Id == CommandId)
    {
      Log.Message("'" + commands.Item(nFindCommands).Id + "' has index " + nFindCommands);
      Log.PopLogFolder();
      return nFindCommands;
    }
  }

  Log.PopLogFolder();
  Log.Error(View.Name + " - '" + View.Title + "' - CommandId '" + CommandId + "' NOT found");
  
  return -1;
}

//------ ExecuteCommand() ---------------------------------------------------------------------------------------------------------------------------//
function ExecuteCommand(View, CommandId)
{
  Log.AppendFolder(unitName + "ExecuteCommand - " + View.Name + " - '" + CommandId + "'");
  var idx = _FindCommandById(View, CommandId);
  
  if (idx > -1)
  {
    Log.Message(View.Name + " - '" + View.Title + "' -  CommandId '" + CommandId + "' with idx " + idx + " executed");
    View.DataContext.Commands.Item(idx).Execute(1);
  }

  Log.PopLogFolder();
}

//------ CheckCommand() ---------------------------------------------------------------------------------------------------------------------------//
function CheckCommand(View, CommandId)
{
  Log.AppendFolder(unitName + "CheckCommand - " + View.Name + " - '" + CommandId + "'");
  var idx = _FindCommandById(View, CommandId);
  
  if (idx > -1)
  {
    Log.Message(View.Name + " - '" + View.Title + "' -  CommandId '" + CommandId + "' with idx " + idx + " checked");
    View.DataContext.Commands.Item(idx).IsChecked = true;
  }
  else
  {
    Log.Error(View.Name + " - '" + View.Title + "' - CommandId '" + CommandId + "' NOT found");
  }

  Log.PopLogFolder();
}


// Only Delphi Scripts has Math module... :-(
function GetAbs(n)
{
  if (n < 0)
    return n * (-1);
  else
    return n;
}

//A random integer within the [min; max] interval
function GetRandomInt(min, max)
{
  return Math.round(Math.random()*(max-min)+min);
}

function _testPollForProperty()
{
  PollForProperty(Aliases.GenieApp.Menu, "Visible", true, 5);
}
// PollForProperty -----------------------------------------------------------------------------------------------------------------
function PollForProperty(controlAlias, strPropertyName, strPropertyValue, nLoopCount)
{
  Log.AppendFolder(unitName + "PollForProperty(" + controlAlias + ", " + strPropertyName + ", " + strPropertyValue + ", " + nLoopCount+ ")");
  var bResult = false;

  for (n = 1; n < nLoopCount; n++)
  {
    Delay(1000);
    
    if (aqObject.CheckProperty(controlAlias, strPropertyName, cmpEqual, strPropertyValue))
    {
      bResult = true;
      Log.Checkpoint("PollForProperty success after " + n + " second(s)");
      break;
    }
  }

  if (!bResult)
  {
      Log.Warning("PollForProperty no success after " + nLoopCount + " second(s)");
  }
  
  Log.PopLogFolder();  
  return bResult;
}






//------ WaitForVisible() ---------------------------------------------------------------------------------------------------------------------------//
// Waits 10 x the timeout for an objec to apear on screen.
function WaitForVisible(g_object)
{
  var i = 0;
  var w;
  while(1)
  {
    w = g_object;
    i = i + 1;
    if ( (w.Exists && w.VisibleOnScreen) || (i > 10) )
      break;
  }
}








// Some nice useful methods to have a unique handling in the scripts ...
function testCustomLogEntries()
{
  Log.AppendFolder(unitName + "testCustomLogEntries Log.Message()");
  testLogTestPreConditionHint();  
  Log.Link("www.bernafon.ch", "Log.Link()");
  testLogLinkToDOORS();
  testLogLinkToKnownTfsBug();
  testLogLinkToKnownRqmBug();
  Log.Warning("Log.Warning()");
  testLogIntermediateError();
  testLogScriptingWarning();
  Log.Error("Log.Error()");
  Log.Checkpoint("Log.Checkpoint()");
  Log.Event("Log.Event()");
  Log.PopLogFolder();
}

function testLogTestPreConditionHint() { LogTestPreConditionHint("Make sure HI's (binaural) are connected to the selected programming interface and ready for fitting"); }
// LogTestPreConditionHint -----------------------------------------------------------------------------------------
function LogTestPreConditionHint(strHint)
{
  var attr = Log.CreateNewAttributes();
  attr.Bold = false;
  attr.Italic = true;
  attr.FontColor = BuiltIn.clGreen;
  attr.BackColor = BuiltIn.clWhite;

  Log.Message("TestPreCondition: Hint see 'Additional Info' tab", strHint, pmNormal, attr);
}

function testLogLinkToKnownTfsBug() { LogLinkToKnownTfsBug(62633); }
// LogLinkToKnownTfsBug -----------------------------------------------------------------------------------------
function LogLinkToKnownTfsBug(nTfsId)
{
  var attr = Log.CreateNewAttributes();
  attr.Bold = true;
  attr.FontColor = BuiltIn.clRed;
  attr.BackColor = BuiltIn.clWhite;
  // http://kbndvtfs31:8080/tfs/FittingSoftware/Planning/_workitems#_a=edit&id=54211
  Log.Link("http://kbndvtfs31:8080/tfs/FittingSoftware/Planning/_workitems#_a=edit&id=" + nTfsId, "TFS item #" + nTfsId, "reported bug / known reason for error on test", pmHigher, attr);
}

function testLogLinkToKnownRqmBug() { LogLinkToKnownRqmBug(520); }
// LogLinkToKnownRqmBug -----------------------------------------------------------------------------------------
function LogLinkToKnownRqmBug(nRqmId)
{
  var attr = Log.CreateNewAttributes();
  attr.Bold = true;
  attr.FontColor = BuiltIn.clRed;
  attr.BackColor = BuiltIn.clWhite;
  // https://clm.dgs.com/ccm/web/projects/WDH%20Defects#action=com.ibm.team.workitem.viewWorkItem&id=520
  
  Log.Link("https://clm.dgs.com/ccm/web/projects/WDH%20Defects#action=com.ibm.team.workitem.viewWorkItem&id=" + nRqmId, "RQM bug item #" + nRqmId, "reported bug / known reason for error on test", pmHigher, attr);
}

function testLogLinkToDOORS() { LogLinkToDOORS("SID_PREF_159", "doors://kbnbsapp01:36677/?version=2&prodID=0&view=00000002&urn=urn:telelogic:bd296f88-9851-11e1-a2e8-81ba7d9bf10c:1-4fa78175254e4271-O-150-00004861"); }
// LogLinkToDOORS -----------------------------------------------------------------------------------------
function LogLinkToDOORS(strDoorsId, strDoorsUrl)
{
  // SID_Preferences: "doors://kbnbsapp01:36677/?version=2&prodID=0&view=00000002&urn=urn:telelogic:bd296f88-9851-11e1-a2e8-81ba7d9bf10c:1-4fa78175254e4271-O-150-00004861"
  // PR_Genesis:      "doors://kbnbsapp01:36677/?version=2&prodID=0&view=00000001&urn=urn:telelogic:bd296f88-9851-11e1-a2e8-81ba7d9bf10c:1-4fa78175254e4271-O-18557-00002324"
  var attr = Log.CreateNewAttributes();
  attr.Italic = true;
  attr.FontColor = BuiltIn.clBlue;
  attr.BackColor = BuiltIn.clWhite;
  // Applies these attributes to a message
  Log.Link(strDoorsUrl, "DOORS ID: " + strDoorsId, "Verification of requirement", pmNormal, attr);
}

function testLogLinkToDOORSFromReqNo() { LogLinkToDOORSFromReqNo("PREF_102");}
// LogLinkToDOORS -----------------------------------------------------------------------------------------
function LogLinkToDOORSFromReqNo(strDoorsId)
{
    //https://doors.dgs.com:8443/dwa/dwa.jsp?urn=urn:rational:bd296f88-9851-11e1-a2e8-81ba7d9bf10c:1-4fa78175254e4271-O-102-0000232f&doors.view=00000001
    //https://doors.dgs.com:8443/dwa/dwa.jsp?urn=urn:rational:bd296f88-9851-11e1-a2e8-81ba7d9bf10c:1-4fa78175254e4271-O-522-0000232f&doors.view=00000001

  var attr = Log.CreateNewAttributes();
  attr.Italic = true;
  attr.FontColor = BuiltIn.clBlue;
  attr.BackColor = BuiltIn.clWhite;
  // Applies these attributes to a message

  var strDoorsUrl = "https://doors.dgs.com:8443/dwa/dwa.jsp?urn=urn:rational:bd296f88-9851-11e1-a2e8-81ba7d9bf10c:1-4fa78175254e4271-O-" + strDoorsId.replace(/\D/g,'') + "-0000232f&doors.view=00000001";
  Log.Link(strDoorsUrl, "DOORS ID: " + strDoorsId, "Verification of requirement", pmNormal, attr);
}

function testLogUsageLinkToDOORSFromReqNo() { LogUsageLinkToDOORSFromReqNo("PREF_102", "AV"); }
// LogUsageLinkToDOORSFromReqNo -----------------------------------------------------------------------------------------
function LogUsageLinkToDOORSFromReqNo(strDoorsId, strColumns)
{
    //https://doors.dgs.com:8443/dwa/dwa.jsp?urn=urn:rational:bd296f88-9851-11e1-a2e8-81ba7d9bf10c:1-4fa78175254e4271-O-102-0000232f&doors.view=00000001
    //https://doors.dgs.com:8443/dwa/dwa.jsp?urn=urn:rational:bd296f88-9851-11e1-a2e8-81ba7d9bf10c:1-4fa78175254e4271-O-522-0000232f&doors.view=00000001

  var attr = Log.CreateNewAttributes();
  attr.Italic = true;
  attr.FontColor = BuiltIn.clBlue;
  attr.BackColor = BuiltIn.clWhite;
  // Applies these attributes to a message

  var strDoorsUrl = "https://doors.dgs.com:8443/dwa/dwa.jsp?urn=urn:rational:bd296f88-9851-11e1-a2e8-81ba7d9bf10c:1-4fa78175254e4271-O-" + strDoorsId.replace(/\D/g,'') + "-0000232f&doors.view=00000001";
  Log.Link(strDoorsUrl, "DOORS ID: " + strDoorsId + " > " + strColumns , "Verification of requirement, Cloud column(s): " + strColumns, pmNormal, attr);
}

function testLogIntermediateError() { LogIntermediateError(".\\EarMeasurementSystems\\MockMeasurementSystem.dll found. Genie setup must not install this file!"); }
// LogIntermediateError -----------------------------------------------------------------------------------------
function LogIntermediateError(strHint)
{
  if (!Project.Variables.bLogIntermediateError)
    return;
    
  var attr = Log.CreateNewAttributes();
  attr.Italic = true;
  attr.FontColor = BuiltIn.clYellow;
  attr.BackColor = BuiltIn.clBlack;
  // Applies these attributes to a message
  Log.Warning("Intermediate error / warning: Hint see 'Additional Info' tab", strHint, pmNormal, attr);
}

function testLogScriptingWarning() { LogScriptingWarning("OpenAndSaveRemSystemSelected: Invalid / unsupported argument in function call"); }
// LogScriptingWarning -----------------------------------------------------------------------------------------
function LogScriptingWarning(strHint)
{
  if (!Project.Variables.bLogScriptingWarning)
    return;
    
  var attr = Log.CreateNewAttributes();
  attr.Italic = true;
  attr.FontColor = BuiltIn.clBlack;
  attr.BackColor = BuiltIn.clYellow;
  // Applies these attributes to a message
  Log.Warning("Scripting warning: Hint see 'Additional Info' tab", strHint, pmNormal, attr);
}


//------ GetFileSize() ---------------------------------------------------------------------------------------------------------------------------//
function GetFileSize(FileName)
{
  var fs, file;
  fs = Sys.OleObject("Scripting.FileSystemObject");
  if (fs.FileExists(FileName))
  {
    file = fs.GetFile(FileName);
      return file.Size;
  }
  else
    return -1;
}

//------ SetnUpperLimitTo50() ---------------------------------------------------------------------------------------------------------------------------//
function SetnUpperLimitTo50()
{
  Log.Message(unitName + "SetnUpperLimitTo50");
  Project.Variables.nUpperLimit = 50;
}

//------ ScreenInfo() ---------------------------------------------------------------------------------------------------------------------------//
// Get the screen info
function ScreenInfo()
{
  Log.AppendFolder("ScreenInfo")
  var objWMIService = GetObject("winmgmts:\\\\.\\root\\cimv2");
  var colItems = objWMIService.ExecQuery("SELECT * FROM Win32_DesktopMonitor");
  var enumItems = new Enumerator(colItems);

  var item;
  for (; !enumItems.atEnd(); enumItems.moveNext())
  {
    item = enumItems.item();
    Log.Message("Description: " + item.Description);
    Log.Message("Screen height: " + item.ScreenHeight);
    Log.Message("Screen width: " + item.ScreenWidth);
  }
  Log.PopLogFolder();
}

//------ ResetUserPreferences() ---------------------------------------------------------------------------------------------------------------------------//
// Resets the UserPreference.xml file to default (non configurations) 
function ResetUserPreferences()
{ 
  Log.AppendFolder("ResetUserPreferences")
  var CmpPth = Project.Variables.CompositionPath;
  var newchar = '\\';
  CmpPth = CmpPth.split('\\\\').join(newchar);

  if(aqFile.Exists(CmpPth + "UserPreferences.xml"))
    aqFile.Delete(CmpPth + "UserPreferences.xml");

  aqFile.Copy(ProjectSuite.Path + "\CustomStores\\UserPreferences.xml" , CmpPth + "UserPreferences.xml")
  Log.PopLogFolder();
}