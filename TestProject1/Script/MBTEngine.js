var unitName = "MBTEngine.";
var unitLogPrefix = "MBTEngine -> ";
var lineCount = 0;

function _TestRunFolder()
{
  Log.Message(unitName + "_TestRunFolder"); 
//  RunTcDdtFolder("D:\\tcddt");
//  RunTcDdtFolder("D:\\tcddt", "MBT.DummyMethod");
//  RunTcDdtFolder("D:\\tcddt", "MBT.DummyMethod", "MBT.DummyMethod");
  RunTcDdtFolder("D:\\tcddt", "MBTEngine.DummyMethod", "MBTEngine.DummyMethod", "MBTEngine.DummyMethod");  
}

//------ RunTcDdtFolder ---------------------------------------------------------------------------------------------------------------------------//
function RunTcDdtFolder(tcddtFolder, initOnce, initEach, cleanupEnd)
{
  Log.Message(unitName + "RunTcDdtFolder(" + tcddtFolder + ")"); 
  var oFolder, colFiles, file, tcddtfile, fullname;
  var StopWatchObjAll = HISUtils.StopWatch;
  StopWatchObjAll.Start();
  lineCount = 0;

  oFolder = aqFileSystem.GetFolderInfo(tcddtFolder);
  colFiles = oFolder.Files;

  if (initOnce == undefined)
  {
    InitOnce();
  }
  else
  {
    LogMethodCall(initOnce, "initOnce")
    Runner.CallMethod(initOnce);  
  }
    
  while (colFiles.HasNext())
  {
    tcddtfile = colFiles.Next();
    fullname = tcddtFolder + "\\" + tcddtfile.Name;
    
    // Exclusion filter for files to be ignored (if left in folder by accidant)
    if (   -1 != aqString.Find(tcddtfile.Name, "_List.csv")
        || -1 != aqString.Find(tcddtfile.Name, "_FunctionHeaders.sj") )
    {
      LogFileIgnored(fullname);
      continue;
    }  
 
    if (initEach == undefined)
    {
      InitEach();
    }
    else
    {
      LogMethodCall(initEach, "initEach");
      Runner.CallMethod(initEach);  
    }
         
    ProcessTcDdtFile(fullname);    
  }
  
  StopWatchObjAll.Stop();
  LogSummary(tcddtFolder, lineCount, StopWatchObjAll.ToString());    
    
  if (cleanupEnd == undefined)
  {
    CleanupEnd();
  }
  else
  {
    LogMethodCall(cleanupEnd, "cleanupEnd");
    Runner.CallMethod(cleanupEnd);  
  }
}

function _TestProcessTcDdtFile()
{
  Log.Message(unitName + "_TestProcessTcDdtFile"); 
  ProcessTcDdtFile("D:\\tcddt\\OpenAllToolsStraight_1.csv");
//  ProcessTcDdtFile("D:\\tcddt\\OpenAllToolsStraight_08.csv");  
}

//------ ProcessTcDdtFile ---------------------------------------------------------------------------------------------------------------------------//
function ProcessTcDdtFile(filename)
{
  Log.Message(unitName + "ProcessTcDdtFile"); 
  LogFileName(filename);
    
  var tcddtfile = aqFile.OpenTextFile(filename, aqFile.faRead, aqFile.ctANSI);
  var line = 1;
  var StopWatchObj = HISUtils.StopWatch;
  StopWatchObj.Start();
  tcddtfile.Cursor = 0;
    
  while(!tcddtfile.IsEndOfFile())
  {
    Unit_MethodName = tcddtfile.ReadLine();
    LogLine(line, Unit_MethodName);
    line++;
    Runner.CallMethod(Unit_MethodName);
  }
    
  tcddtfile.Close();
  StopWatchObj.Stop();
  lineCount += (line - 1);
   
  LogSummary(filename, line - 1, StopWatchObj.ToString());    
}

//------ LogTestPreConditionHint ---------------------------------------------------------------------------------------------------------------------------//
function LogLine(line, Unit_MethodName)
{
  var attr = Log.CreateNewAttributes();
  attr.Bold = true;
  attr.Italic = true;
  attr.BackColor = BuiltIn.clWhite;
  attr.FontColor = BuiltIn.clGray;

  Log.Message(unitLogPrefix + "Line " + line + ": '" + Unit_MethodName + "' ---------------------------------------------------------------------------------------------------", "", pmNormal, attr);
}

//------ LogFileName ---------------------------------------------------------------------------------------------------------------------------//
function LogFileName(filename)
{
  var attr = Log.CreateNewAttributes();
  attr.Bold = true;
  attr.Italic = true;
  attr.BackColor = BuiltIn.clGreen;
  attr.FontColor = BuiltIn.clWhite;

  Log.Message(unitLogPrefix + "Start processing " + filename, "", pmNormal, attr);
}

//------ LogSummary ---------------------------------------------------------------------------------------------------------------------------//
function LogSummary(filename, lines, timetotal)
{
  var attr = Log.CreateNewAttributes();
  attr.Bold = true;
  attr.Italic = true;
  attr.BackColor = BuiltIn.clYellow;
  attr.FontColor = BuiltIn.clBlack;

  Log.Message(unitLogPrefix + "End processing " + filename + " - " + lines + " method calls - Elapsed time: " + timetotal, "Details not implemented yet", pmNormal, attr);
}

//------ LogTestPreConditionHint ---------------------------------------------------------------------------------------------------------------------------//
function LogFileIgnored(filename)
{
  var attr = Log.CreateNewAttributes();
  attr.Bold = true;
  attr.Italic = true;
  attr.FontColor = BuiltIn.clRed;
  attr.BackColor = BuiltIn.clWhite;

  Log.Message(unitLogPrefix + "Ignored for processing " + filename, "", pmNormal, attr);
}

//------ LogTestPreConditionHint ---------------------------------------------------------------------------------------------------------------------------//
function LogMethodCall(method, mbtcontrol)
{
  var attr = Log.CreateNewAttributes();
  attr.Bold = true;
  attr.Italic = true;
  attr.FontColor = BuiltIn.clWhite;
  attr.BackColor = BuiltIn.clDkGray;

  Log.Message(unitLogPrefix + "Method call: " + method + " as " + mbtcontrol, "", pmNormal, attr);
}

//------ InitOnce ---------------------------------------------------------------------------------------------------------------------------//
// 
function InitOnce()
{
  Log.Error(unitLogPrefix + "Missing InitOnce argument - Initialisation method required to be run ONCE BEFORE processing the sequences"); 
}

//------ InitEach ---------------------------------------------------------------------------------------------------------------------------//
function InitEach()
{
  Log.Error(unitLogPrefix + "Missing InitEach argument - Initialisation method required to be run BEFORE EACH sequence"); 
}

//------ CleanupEnd ---------------------------------------------------------------------------------------------------------------------------//
function CleanupEnd()
{
  Log.Error(unitLogPrefix + "Missing CleanupEnd argument - Cleanup method required to be run AFTER processing ALL sequences"); 
}

//------ DummyMethod ---------------------------------------------------------------------------------------------------------------------------//
function DummyMethod()
{
  Log.Warning(unitName + "DummyMethod called"); 
}

//------ GenerateSequences ---------------------------------------------------------------------------------------------------------------------------//
function GenerateSequences()
{
  Log.Message(unitName + "GenerateSequences"); 
  Log.Message(Project.Variables.strRootGraphml2TcDdt + " " + Project.Variables.strClaGraphml2TcDdt);
  
  TestedApps.Graphml2TcDdt.Run();
  Delay(Project.Variables.nTimeoutGraphml2TcDdt * 1000 + 2000); // Wait defined time before processing files
}