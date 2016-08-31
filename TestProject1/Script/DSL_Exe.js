//USEUNIT MBT_Engine
//USEUNIT TcUtil

var unitName = "DSL_Exe";
function RunPilot()
// Runs pilot chapter.
{
  RunChapter("Chapter1");
  //RunChapter("7_Hearing_loss_compensation\\7_7_Target_match")
}
// ----- Description RunChapter ------
// Runs the requirement chapter specified in the "chapter parameter"
// @param {chapter} test folder name
function RunChapter(chapter)
{
  Log.Message(unitName + "RunChapter"); 
  var folderpath = ProjectSuite.Path + "TestProject1\\SoundStudio\\" + chapter + "\\";
  // Run test engine with specified test folder
  RunTcDdtFolder(folderpath, "DSL_Exe.SetupRun", "DSL_Exe.SetupIterationData", "DSL_Exe.TearDown");  
}

// ----- Setup test ------
// Sets up test.
function SetupRun()
{
  var attr = Log.CreateNewAttributes();
  attr.Bold = true;
  attr.Italic = true;
  attr.FontColor = BuiltIn.clWhite;
  attr.BackColor = BuiltIn.clDkGray;
  
  Log.AppendFolder(unitName + "SetupRun", "", pmNormal, attr);
  Log.PopLogFolder();
}
// ----- Setup iteration data ------
// Sets up iteration data.
function SetupIterationData()
{
  Log.AppendFolder(unitName + " SetupIterationData"); 
  Log.PopLogFolder();
}

// ----- Tear down ------
// Logs Tear down.
function TearDown()
{
  Log.AppendFolder(unitName + "TearDown"); 
  Log.PopLogFolder();
}
 
// ----- RunTcDdtFolder ------
// Execute all tests in the specified folder. 
// @param {tcddtFolder} folder path for test files
// @param {initOnce} Setup test
// @param {initEach} Setup iteration data
// @param {cleanupEnd} Tear down
function RunTcDdtFolder(tcddtFolder, initOnce, initEach, cleanupEnd)
{
  var attrFolder = Log.CreateNewAttributes();
  attrFolder.Bold = true;
  attrFolder.Italic = true;
  attrFolder.FontColor = BuiltIn.clWhite;
  attrFolder.BackColor = BuiltIn.clDkGray;
  
  Log.Message("Executing folder: " + tcddtFolder, "", pmNormal, attrFolder);
  //  Log.Message("UnitName: " + unitName);  
  var oFolder, colFiles, file, tcddtfile, fullname;
  var lineCount = 0;
  var StopWatchObjAll = HISUtils.StopWatch;
 
  var NonStrictFlow = true;
  var ContinousFlow = true;
  // Start timer
  StopWatchObjAll.Start();
  if(!aqFileSystem.Exists(tcddtFolder))
  { 
    Log.Error("Desired folder: " + tcddtFolder + " Does not excist", "Needs fixing \nDesired folder: " + tcddtFolder + " Does not excist", pmHighest);
    Runner.Stop();
  }
  // Get folder info from path (tcddtFolder)
  oFolder = aqFileSystem.GetFolderInfo(tcddtFolder);
  // Get all files in test folder
  colFiles = oFolder.Files;
  
  // Setup Run
  if (initOnce == undefined)
    InitOnce();
  else
  {
    LogMethodCall(initOnce, "initOnce");
    Runner.CallMethod(initOnce);  
  }
    
  // If files exist in test folder  
  if (colFiles != null)
  {
    // Iterates through all files 
    while (colFiles.HasNext())
    {
      // Get next file in test folder
      tcddtfile = colFiles.Next();
      
      var TestDefinitionContent = "";
      
      if (-1 != aqString.Find(tcddtfile.Name, ".tdf"))
      {
        var definitionfilename = tcddtFolder + "\\" +tcddtfile.Name;
        //Log.Message(definitionfilename);
        TestDefinitionContent = aqFile.ReadWholeTextFile(definitionfilename, aqFile.ctUTF8);
        
        // Specifies new attributes
        var attrFolder = Log.CreateNewAttributes();
        attrFolder.Bold = true;
        attrFolder.Italic = true;
        attrFolder.BackColor = BuiltIn.clGreen;
        
        Log.AppendFolder("TestDefinition Loaded: " + tcddtfile.Name, TestDefinitionContent, pmNormal, attrFolder);   
        // [Requirement:]        
        var reqs = aqString.SubString(TestDefinitionContent, 
            (aqString.Find(TestDefinitionContent, "[Requirement:]") + aqString.GetLength("[Requirement:]")), 
             aqString.Find(TestDefinitionContent,"[TestDescription:]")-14); 
        reqs = reqs.split(",");    

        for(req in reqs) LogLinkToDOORSFromReqNo(aqString.Trim(reqs[req]));
        
        // [TestDescription:]
        var TestDescription = aqString.SubString(TestDefinitionContent, 
            (aqString.Find(TestDefinitionContent, "[TestDescription:]")) , 
             aqString.Find(TestDefinitionContent,"[ClientDataFile:]")-aqString.Find(TestDefinitionContent, "[TestDescription:]")); 

        Log.Message("TestDescription: ",TestDescription);

        //[NonStrictFlow:TRUE|FALSE]
        var NonStrictFlow;
        if(-1 < aqString.Find(TestDefinitionContent, "[StrictFlow:TRUE]")) Project.Variables.bStrictFlow = true;
        else if(-1 < aqString.Find(TestDefinitionContent, "[StrictFlow:FALSE]")) Project.Variables.bStrictFlow = false;
        else 
        {
          Log.Message("Project.Variables.bStrictFlow = false. Because nothing was specified in the Test Definition file.");
          Project.Variables.bStrictFlow = false;
        }
        
        Log.Message("StrictFlow: " + Project.Variables.bStrictFlow);
        
        // [ContinousFlow:TRUE|FALSE]             
        if(-1 < aqString.Find(TestDefinitionContent, "[ContinousFlow:TRUE]")) Project.Variables.bContinousFlow = true;
        else if(-1 < aqString.Find(TestDefinitionContent, "[ContinousFlow:FALSE]")) Project.Variables.bContinousFlow = false;
        else
        {
          Log.Message("Project.Variables.bContinousFlow = true. Because nothing was specified in the Test Definition file.");
          Project.Variables.bContinousFlow = true;
        }
                               
        Log.Message("ContinousFlow: " + ContinousFlow);

        // [ClientDataFile:]     
        var Noahfilenames = aqString.SubString(TestDefinitionContent, 
            (aqString.Find(TestDefinitionContent, "[ClientDataFile:]") + aqString.GetLength("[ClientDataFile:]")), 
             (aqString.Find(TestDefinitionContent,"[TestDataFile:]")-(aqString.Find(TestDefinitionContent, "[ClientDataFile:]") + aqString.GetLength("[ClientDataFile:]"))));
        if(aqString.Trim(Noahfilenames) !="")
        {
          Noahfilenames = Noahfilenames.split(",");
          Log.Message("ClientDataFiles: " + Noahfilenames);  
        
          // Make the script handle multiple clientdata files. And load them into Genie, before test start up.
          // Then load the test data files
          for(i in Noahfilenames)
          {
            // Set file name for Noah file
            //Noahfilenames[i] =  aqString.Remove(tcddtfile.Name, (aqString.GetLength(tcddtfile.Name)-3),3);
            Noahfilenames[i] = tcddtFolder + aqString.Trim(Noahfilenames[i]);  
            
            if(aqString.Find(Noahfilenames[i], ".csv")!=-1)
            {
              Log.Error("Did you confuse Client Data with test data??", Noahfilenames[i]);
              Runner.Stop();
            }
          }        
        }  
        else Log.Message("No Client Data Files.")
           
        // [TestDataFile:]
        var datafilename = aqString.SubString(TestDefinitionContent, 
            (aqString.Find(TestDefinitionContent, "[TestDataFile:]")) , 
             aqString.Find(TestDefinitionContent,"[OfficeSystem:]")-aqString.Find(TestDefinitionContent, "[TestDataFile:]")); 
        datafilename = aqString.Replace(datafilename, "[TestDataFile:]", "");
        Log.Message("TestDescription: ",TestDescription);
        if(aqString.Trim(datafilename)!="")
        {     
          Log.Message("TestDataFile: " + datafilename); 
          datafilename = tcddtFolder + "\\" + aqString.Trim(datafilename);
        }        
        else Log.Message("No TestDataFile");
        
        if(aqString.Find(datafilename, ".nha")!=-1)
        {
          Log.Error("Did you confuse Client Data with test data??", datafilename);
          Runner.Stop();
        }

        // [OfficeSystem:]
        var OfficeSystem = aqString.SubString(TestDefinitionContent, 
            (aqString.Find(TestDefinitionContent, "[OfficeSystem:]")) , 
             aqString.Find(TestDefinitionContent,"[Connected:")-aqString.Find(TestDefinitionContent, "[OfficeSystem:]")); 
        OfficeSystem = aqString.Replace(OfficeSystem, "[OfficeSystem:]", "");
        if(aqString.Trim(OfficeSystem)!="")
        {     
          Log.Message("OfficeSystem: " + OfficeSystem); 
          if(aqString.ToLower(OfficeSystem) != "noah") Project.Variables.bStandalone = false;
          else Project.Variables.bStandalone = true;
        }        
        else Log.Message("No OfficeSystem. Noah is default");
        
        // [Connected:]
        // Form TDF [Connected:FALSE|EMULATOR|EXPRESSLINK|HIPRO|HIPRO2|]
        if(aqString.Find(TestDefinitionContent, "[Connected:FALSE]") != -1)             Project.Variables.Connected = "False";
        else if(aqString.Find(TestDefinitionContent, "[Connected:EMULATOR]") != -1)     Project.Variables.Connected = "EMULATOR";
        else if(aqString.Find(TestDefinitionContent, "[Connected:EXPRESSLINK]") != -1)  Project.Variables.Connected = "EXPRESSLINK";
        else if(aqString.Find(TestDefinitionContent, "[Connected:HIPRO2]") != -1)       Project.Variables.Connected = "HIPRO2";
        else if(aqString.Find(TestDefinitionContent, "[Connected:HIPRO]") != -1)        Project.Variables.Connected = "HIPRO";
        else Project.Variables.Connected = "False";
          
        Log.Message("Programming device connected in test: " + Project.Variables.Connected);
        
        //[Instrument Right side]
        //Form TDF [RightSide:None|OPN1] "None" instrument is is default th is default if nothing specified.
        if(aqString.Find(TestDefinitionContent, "[RightSide:OPN1]") != -1) Project.Variables.RightSide = "OPN1";
        else Project.Variables.RightSide = "None";  
        Log.Message("Instrument Right Side: " + Project.Variables.RightSide);
        
        //[Instrument Left side]
        //Form TDF [RightSide:None|OPN1] "None" instrument is is default th is default if nothing specified.
        if(aqString.Find(TestDefinitionContent, "[LeftSide:OPN1]") != -1) Project.Variables.LeftSide = "OPN1";
        else Project.Variables.LeftSide = "None";
        Log.Message("Instrument Left Side: " + Project.Variables.LeftSide);
        
        if(Project.Variables.RightSide != "None" && Project.Variables.LeftSide != "None") Project.Variables.Sides = "both";
        else if(Project.Variables.RightSide == "None" && Project.Variables.LeftSide != "None") Project.Variables.Sides = "left";
        else if(Project.Variables.RightSide != "None" && Project.Variables.LeftSide == "None") Project.Variables.Sides = "right";
        else Log.Error("Not able to decipher instrument sides selection");        
                 
        fullname = tcddtFolder + "\\" + tcddtfile.Name;  
        
        var s_tcddtfile
         // Exclusion filter for files to be ignored (if left in folder by accidant)
        if (   -1 != aqString.Find(tcddtfile.Name, "_List.csv")
            || -1 != aqString.Find(tcddtfile.Name, "_FunctionHeaders.sj")
            || -1 != aqString.Find(tcddtfile.Name, ".nhax") // Noah files excluded
            || -1 != aqString.Find(tcddtfile.Name, ".nha")  // Noah files excluded
            || -1 != aqString.Find(tcddtfile.Name, ".docx")
            || -1 != aqString.Find(tcddtfile.Name, "Data.csv") )
        {
          LogFileIgnored(fullname);
          continue;
        }
        else if (-1 != aqString.Find(tcddtfile.Name, ".tdf"))
        { 
          s_tcddtfile = tcddtfile.Name;
          s_tcddtfile = aqString.Remove(s_tcddtfile, (aqString.GetLength(s_tcddtfile)-3), 3);
          s_tcddtfile = s_tcddtfile + "csv";
        } 
      
        // Setup Iteration Data
        if (initEach == undefined) InitEach();
        else
        {
          LogMethodCall(initEach, "initEach");
          Runner.CallMethod(initEach);  
        }

        Log.Message(unitName + ": ProcessTcDdtFile"); 
        // Set filename for test file
        filename = tcddtFolder + "\\" + s_tcddtfile;
      
        // Open test file
        if(!aqFile.Exists(filename))
        {
          // Specifies new attributes
          var attr = Log.CreateNewAttributes();
          attr.Bold = true;
          attr.Italic = true;
          attr.BackColor = BuiltIn.clRed;
          Log.Error("Could not find Test: " + filename, "The Test: '" + filename + "' Could not be found. Are you sure it was save to the correct location?" ,pmHighest, attr);
          Runner.Stop();
        }

        var tcddtfile = aqFile.OpenTextFile(filename, aqFile.faRead, aqFile.ctANSI);
        var line = 1;
        var StopWatchObj = HISUtils.StopWatch;
        StopWatchObj.Start();
        tcddtfile.Cursor = 0;
        
        // Specifies new attributes
        var attr = Log.CreateNewAttributes();
        attr.Bold = true;
        attr.Italic = true;
        attr.BackColor = BuiltIn.clLime;
        
        Log.PopLogFolder();
        // Running the test from file
        Log.AppendFolder("Running Test: " + s_tcddtfile, "Running Test: " + filename, pmNormal, attr);
        
        // For handling reentrering af macrog keyword in a desired state.
        var i_Sys_ToggleOpenState = Noahfilenames.length;
        //if(Noahfilenames.length > 1) Project.Variables.Sys_ToggleOpenState = true;
        
        // Loading the client data files into genie
        if( typeof Noahfilenames == "object")
        {
          Log.AppendFolder("Datafile exists: " + datafilename);
          for(i in Noahfilenames) 
          {
            // If Noah client file exist (Noah3 or Noah4), open Genie and import Noah clients
            if (aqFile.Exists(Noahfilenames[i]))// + "nhax"))
            { 
              if(0 == i) Project.Variables.Sys_ToggleOpenState = false;
              else if(i_Sys_ToggleOpenState <= (i+1)) Project.Variables.Sys_ToggleOpenState = true;
              else Project.Variables.Sys_ToggleOpenState = false;
              
          // Hand merged not verified
              //OpenGenieAndLoadNoahClients(Noahfilenames[i]);// + "nhax");
            //else if (aqFile.Exists(Noahfilenames[i] + "nha"))   
            //  OpenGenieAndLoadNoahClients(Noahfilenames[i] + "nha"); 
                                                 
              if (Project.Variables.bStandalone) OpenGenieAndLoadNoahClients(Noahfilenames[i]);
              else
              {
                OpenNoah4AndLoadClients(Noahfilenames[i]);
                OpenNoah4AndLoadClientsPostActions();                
              }
            } 
            else                                                
              Log.Message("No Noah client file with that name: " + Noahfilenames[i]);       
          }
        }
        else
        {
          if(!Project.Variables.bContinousFlow || Project.Variables.firstIteration)
          {
            Project.Variables.firstIteration = false;
            Project.Variables.Sys_ToggleOpenState = true; 
            G_App.OpenMaximized();
            G_App.v_Open();
          }
        }
        
        Log.PopLogFolder();  
        
        // Check if data file exist
        if(aqFile.Exists(datafilename) && !(tcddtFolder + "\\" == datafilename))
          {  
          Log.AppendFolder("Datafile exists: " + datafilename);
          var Driver = DDT.CSVDriver(datafilename);;
          var iterations = 0;
          // Get number of test iterations from data file
          Log.Message(aqFile.GetSize(datafilename));

          if(aqFile.GetSize(datafilename)>0)
          {
            while (!Driver.EOF()) 
            { 
              iterations++;
              Driver.Next(); 
            } 
        
            Log.Message("Test iterations: " + iterations);
            Log.PopLogFolder();  
        
            Log.AppendFolder("Running Test");
            // // Loop the data file, and repeat the test
            for (var index = 0; index < iterations; index++)
            {
              Log.AppendFolder("Test iteration: " + index);
              // Reading Data into project variables
              SetProjectVariblesFromTestData(datafilename, index);
              // Read test file and run each test method
              line = RunTestFileMethods(tcddtfile);
              Log.PopLogFolder();
            }
            Log.PopLogFolder();
          }
          else Log.Error("Datafile empty");
        }
        // Data file don't exist  
        else
        {
          if(datafilename=!"") Log.Message("No Data File with that name: " + datafilename);
          else Log.Message("No Data File");
          
          Log.AppendFolder("Running Test");
          // Read test file and run each test method
          line = RunTestFileMethods(tcddtfile);
          Log.PopLogFolder();
        }
        // Close test file and stop timer
        tcddtfile.Close();
        StopWatchObj.Stop();
        lineCount += (line - 1);
        LogSummary(filename, line - 1, StopWatchObj.ToString());
        
        Log.PopLogFolder();
        Log.PopLogFolder();
      }       
    }
  }  
  // Error: Test folder is empty
  else
  {
    var attr = Log.CreateNewAttributes();
    attr.Bold = true;
    attr.Italic = true;
    attr.BackColor = BuiltIn.clWhite;
    attr.FontColor = BuiltIn.clGray;
    Log.Error("No files in folder!", "The folder specified for containing tests, were empty", pmHighest, attr);
  }
  
  StopWatchObjAll.Stop();
  LogSummary(tcddtFolder, lineCount, StopWatchObjAll.ToString());    
  
  // Tear down
  if (cleanupEnd == undefined) CleanupEnd();
  else
  {
    LogMethodCall(cleanupEnd, "cleanupEnd");
    Runner.CallMethod(cleanupEnd);  
  }
} 

// ------ SetProjectVariblesFromTestData ------
// Read test file and execute each test method
// @param {tcddtfile} Test file object
// @return number of method calls
function RunTestFileMethods(tcddtfile)
{
  //Programming device connected in test: EMULATOR
  if(Project.Variables.Connected == "EMULATOR")
  {
    Log.AppendFolder("Starting and selecting the emulator");
    Emulator.StartEmulator();
    if(Project.Variables.Sides == "both") Emulator.ProgramBothHI();
    else if(Project.Variables.Sides == "left") Emulator.ProgramLeftHI();
    else if(Project.Variables.Sides == "right") Emulator.ProgramRightHI();
    else
    {
      Log.Warning("Could not decipher side from 'Project.Variables.Sides' value of: " + Project.Variables.Sides, "Programming both sides!!!");
      Emulator.ProgramBothHI();
    }
    
    Delay(3000);
    G_App.OpenPreferences();
    G_App.SelectPreferencesCommunicationMedium();
    Aliases.GenieDialog.Preferences.CommunicationMediumView.Detect.Click();
    Delay(5000);
    Aliases.GenieDialog.Preferences.CommunicationMediumView.Emulator.Click();
    Delay(500);
    Aliases.GenieDialog.Preferences.CommunicationMediumView.Select.Click();
    Delay(3000);
    Aliases.GenieDialog.Preferences.Ok.Click();
    Delay(3000);
    Log.PopLogFolder();    
  }
  else Log.Message("Non connected scenario!");

  var unitMethodName = "DSL_Exe";
  var line = 1;
  // Set cursor to first item
  tcddtfile.SetPosition(0,0);
  while (!tcddtfile.IsEndOfFile())
  {
      unitMethodName = tcddtfile.ReadLine();
      LogLine(line, unitMethodName);
      line++;
      var res = 0;       
      res =  aqString.Find(unitMethodName,"//");
      if (unitMethodName != "" && res == -1) 
      {
        unitMethodName = aqString.Replace(unitMethodName, "();", "");
        if(!Project.Variables.bStandalone) unitMethodName = aqString.Replace(unitMethodName, "G_ClientListView", "Noah4");
        Runner.CallMethod(unitMethodName);
      }
  }
  
  if(!Project.Variables.bStandalone) Aliases.GenieApp.Close();
  //Programming device connected in test: EMULATOR must be closed
  if(Project.Variables.Connected == "EMULATOR") if (!Sys.WaitProcess("Genie").Exists) Emulator.CloseEmulator();
  // Return number of method calls
  return line;
}

// ------ SetProjectVariblesFromTestData ------
// Load test data file and set all temporary variables
// @param {datafilename} Filename for data file (.csv)
// @param {index} Index of test iteration
function SetProjectVariblesFromTestData(datafilename, index)
{
  Log.AppendFolder(unitName + "SetProjectVariblesFromTestData");

  ClearDefaultProjectVaribles();
  
  var Driver = DDT.CSVDriver(datafilename);
  var ColNum = Driver.ColumnCount;
  var col = "";
  // Move Driver to current row in data file
  for (var i = 0; i < index; i++)
    Driver.Next();
  // Iterates through the columns and set project variable value
  for (var i = 0; i < ColNum; i++)
  {
    col = Driver.ColumnName(i); // Get current column name
    Log.Message("Reading: " + col + " To: " + Driver.Value(col));
    switch(col)
    {
      case "ClientFirstName":
        Project.Variables.ClientFirstName = Driver.Value(col); 
        break;
      case "ClientLastName":
        Project.Variables.ClientLastName = Driver.Value(col); 
        break;
      case "ClientGender":
        Project.Variables.ClientGender = Driver.Value(col);
        break;
      case "ClientBirthdate":
        Project.Variables.ClientBirthdate = Driver.Value(col);
        break;
      case "ClientTitle":
        Project.Variables.ClientTitle = Driver.Value(col);
        break;
      case "ClientAddress1":
        Project.Variables.ClientAddress1 = Driver.Value(col);
        break;
      case "ClientAddress2":
        Project.Variables.ClientAddress2 = Driver.Value(col);
        break;
      case "ClientAddress3":
        Project.Variables.ClientAddress3 = Driver.Value(col);
        break;
      case "ClientCity":
        Project.Variables.ClientCity = Driver.Value(col);
        break;
      case "ClientZipCode":
        Project.Variables.ClientZipCode = Driver.Value(col);
        break;
      case "ClientState":
        Project.Variables.ClientState = Driver.Value(col);
        break;
      case "ClientHomePhone":
        Project.Variables.ClientHomePhone = Driver.Value(col);
        break;
      case "ClientMobilePhone":
        Project.Variables.ClientMobilePhone = Driver.Value(col);
        break;
      case "ClientWorkPhone":
        Project.Variables.ClientWorkPhone = Driver.Value(col);
        break;
      case "ClientFax":
        Project.Variables.ClientFax = Driver.Value(col);
        break;          
      case "ClientEmail":
        Project.Variables.ClientEmail = Driver.Value(col);
        break;
      case "ClientSocialSecurity":
        Project.Variables.ClientSocialSecurity = Driver.Value(col);
        break;          
      case "ClientReferal":
        Project.Variables.ClientReferal = Driver.Value(col);
        break;
      case "ClientPhysician":
        Project.Variables.ClientPhysician = Driver.Value(col);
        break;  
      case "ClientInsurance1":
        Project.Variables.ClientInsurance1 = Driver.Value(col);
        break;
      case "ClientInsurance1No":
        Project.Variables.ClientInsurance1No = Driver.Value(col);
        break;
      case "ClientInsurance2":
        Project.Variables.ClientInsurance2 = Driver.Value(col);
        break;
      case "ClientInsurance2No":
        Project.Variables.ClientInsurance2No = Driver.Value(col);
        break;
      case "ClientComments":
        Project.Variables.ClientComments = Driver.Value(col);
        break;
      case "ClientFirstNameToDelete":
        Project.Variables.ClientFirstNameToDelete = Driver.Value(col);
        break;
      case "SearchText":
        Project.Variables.SearchText = Driver.Value(col);
        break;
      case "ClientID":
        Project.Variables.ClientID = Driver.Value(col);
        break;
      case "ClientLastSession":  
        Project.Variables.ClientLastSession = Driver.Value(col);
        break;
      case "ClientRightHI":
        Project.Variables.ClientRightHI = Driver.Value(col);
        break;
      case "ClientLeftHI":
        Project.Variables.ClientLeftHI = Driver.Value(col);
        break;
      case "AgeGroup":
        Project.Variables.AgeGroup = Driver.Value(col);
        break;        
      case "ExperienceLeft":
        Project.Variables.ExperienceLeft = Driver.Value(col);
        break;
      case "ExperienceRight":
        Project.Variables.ExperienceRight = Driver.Value(col);
        break;
      case "SoundPreferenceQuestion":
        Project.Variables.SoundPreferenceQuestion = Driver.Value(col);
        break;
      case "LowerVolumeQuestion":
        Project.Variables.LowerVolumeQuestion = Driver.Value(col);
        break;
      case "SuddenSoundsQuestion":
        Project.Variables.SuddenSoundsQuestion = Driver.Value(col);
        break;
      case "NoisySurroundingsQuestion":
        Project.Variables.NoisySurroundingsQuestion = Driver.Value(col);
        break;
      case "MoreConfortableSoundQuestion":
        Project.Variables.MoreConfortableSoundQuestion = Driver.Value(col);
        break;
      case "DisturbedBySoundsQuestion":
        Project.Variables.DisturbedBySoundsQuestion = Driver.Value(col);
        break;
      case "AllSoundsQuestionHi":
        Project.Variables.AllSoundsQuestionHi = Driver.Value(col);
        break;
      case "ListeningEnvironmentsQuestion":
        Project.Variables.ListeningEnvironmentsQuestion = Driver.Value(col);
        break;
      case "DisturbedBySoundsNoisyEnvironment":
        Project.Variables.DisturbedBySoundsNoisyEnvironment = Driver.Value(col);
        break;
      case "LouderSpeechQuestion":
        Project.Variables.LouderSpeechQuestion = Driver.Value(col);
        break;
      case "AsMuchSoundAsPossibleQuestion":
        Project.Variables.AsMuchSoundAsPossibleQuestion = Driver.Value(col);
        break;        
      case "Help":
        Project.Variables.Help = Driver.Value(col);
        break;
      case "Brightness":
        Project.Variables.Brightness = Driver.Value(col);
        break;
      case "SoftGain":
        Project.Variables.SoftGain = Driver.Value(col);
        break;
      case "Password":
        Project.Variables.Password = Driver.Value(col);
        break;
      case "P1Label":
        Project.Variables.P1Label = Driver.Value(col);
        break;       
      case "P2Label":
        Project.Variables.P2Label = Driver.Value(col);
        break; 
      case "P3Label":
        Project.Variables.P3Label = Driver.Value(col);
        break; 
      case "P4Label":
        Project.Variables.P4Label = Driver.Value(col);
        break;          
      case "P1Right":
        Project.Variables.P1Right = Driver.Value(col);
        break;
      case "P2Right":
        Project.Variables.P2Right = Driver.Value(col);
        break;
      case "P3Right":
        Project.Variables.P3Right = Driver.Value(col);
        break;
      case "P4Right":
        Project.Variables.P4Right = Driver.Value(col);
        break;  
      case "P1Left":
        Project.Variables.P1Left = Driver.Value(col);
        break;
      case "P2Left":
        Project.Variables.P2Left = Driver.Value(col);
        break;
      case "P3Left":
        Project.Variables.P3Left = Driver.Value(col);
        break;
      case "P4Left":
        Project.Variables.P4Left = Driver.Value(col);
        break;  
      case "P1Comment":
        Project.Variables.P1Comment = Driver.Value(col);
        break;
      case "P2Comment":
        Project.Variables.P2Comment = Driver.Value(col);
        break; 
      case "P3Comment":
        Project.Variables.P3Comment = Driver.Value(col);
        break;
      case "P4Comment":
        Project.Variables.P4Comment = Driver.Value(col);
        break;                      
      case "P1Label":
        Project.Variables.P1Label = Driver.Value(col);
        break;
      case "P2Label":
        Project.Variables.P2Label = Driver.Value(col);
        break; 
      case "P3Label":
        Project.Variables.P3Label = Driver.Value(col);
        break; 
      case "P4Label":
        Project.Variables.P4Label = Driver.Value(col);
        break;    
      // Add new variables here. 
      // Remember to add variable in ClearDefaultProjectVaribles!
      default: 
        break;
    }
  }

  DDT.CloseDriver(DDT.CurrentDriver.Name);
  Log.Message("Done writing data to project variables");
  Log.PopLogFolder();
}

// ------ ClearDefaultProjectVaribles ------
// Clear all temporary variables 
function ClearDefaultProjectVaribles()
{
  Log.AppendFolder(unitName + "ClearDefaultParameterValues");
  Project.Variables.ClientFirstName = "";
  Project.Variables.ClientLastName = "";
  Project.Variables.ClientGender = "";
  Project.Variables.ClientBirthdate = "";
  Project.Variables.ClientTitle = "";
  Project.Variables.ClientAddress1 = "";
  Project.Variables.ClientAddress2 = "";
  Project.Variables.ClientAddress3 = "";
  Project.Variables.ClientCity = "";
  Project.Variables.ClientZipCode = "";
  Project.Variables.ClientState = "";
  Project.Variables.ClientHomePhone = "";
  Project.Variables.ClientMobilePhone = "";
  Project.Variables.ClientWorkPhone = "";
  Project.Variables.ClientFax = "";
  Project.Variables.ClientEmail = "";
  Project.Variables.ClientSocialSecurity = "";
  Project.Variables.ClientReferal = "";
  Project.Variables.ClientPhysician = "";
  Project.Variables.ClientInsurance1 = "";
  Project.Variables.ClientInsurance1No = "";
  Project.Variables.ClientInsurance2 = "";
  Project.Variables.ClientInsurance2No = "";
  Project.Variables.ClientComments = "";
  Project.Variables.ClientFirstNameToDelete = "";
  Project.Variables.SearchText = "";
  Project.Variables.ClientID = "";
  Project.Variables.ClientLastSession = "";
  Project.Variables.ClientRightHI = "";
  Project.Variables.ClientLeftHI = "";
  Project.Variables.AgeGroup = "";
  Project.Variables.ExperienceLeft = "";
  Project.Variables.ExperienceRight = "";
  Project.Variables.SoundPreferenceQuestion = "";
  Project.Variables.LowerVolumeQuestion = "";
  Project.Variables.SuddenSoundsQuestion = "";
  Project.Variables.NoisySurroundingsQuestion = "";
  Project.Variables.MoreConfortableSoundQuestion = "";
  Project.Variables.DisturbedBySoundsQuestion = "";
  Project.Variables.AllSoundsQuestionHi = "";
  Project.Variables.ListeningEnvironmentsQuestion = "";
  Project.Variables.DisturbedBySoundsNoisyEnvironment = "";
  Project.Variables.LouderSpeechQuestion = "";
  Project.Variables.AsMuchSoundAsPossibleQuestion = "";
  Project.Variables.Help = "";
  Project.Variables.Brightness = "";
  Project.Variables.SoftGain = "";
  Project.Variables.Password = "";
  Project.Variables.P1Label = "";
  Project.Variables.P2Label = "";
  Project.Variables.P3Label = "";
  Project.Variables.P4Label = "";
  Project.Variables.P1Right = "";
  Project.Variables.P2Right = "";
  Project.Variables.P3Right = "";
  Project.Variables.P4Right = "";
  Project.Variables.P1Left = "";
  Project.Variables.P2Left = "";
  Project.Variables.P3Left = "";
  Project.Variables.P4Left = "";
  Project.Variables.P1Comment = "";
  Project.Variables.P2Comment = "";
  Project.Variables.P3Comment = "";
  Project.Variables.P4Comment = "";
  Project.Variables.P1Label = "";
  Project.Variables.P2Label = "";
  Project.Variables.P3Label = "";
  Project.Variables.P4Label = "";
  
    // Add new variables here
  Log.Message("Done clearing all project variables");
  Log.PopLogFolder();
}

// ------ OpenGenieAndLoadClients ------
// Open Genie, delete all existing clients and import Noah client file
// @param {NhaxFileName} Filename for Noah client
function OpenGenieAndLoadNoahClients(NhaxFileName)
{
  Log.AppendFolder(unitName + "OpenGenieAndLoadNoahClients");
  Project.Variables.NhaxFileName = NhaxFileName;
  
  // For handling re entrance of importing clients
  // Must be reset after use.
  if(!Project.Variables.Sys_ToggleOpenState) 
  {
    G_App.OpenMaximized();
    G_Util.DeleteAllClients(); // Deleting Clients if any present in database.
    Project.Variables.Sys_ToggleOpenState = false; 
  }
  
  G_Navi.OpenClientListTool(); 
  G_App.OpenImportClientFiles();
  G_ImportClientDataView.ImportAll();

  Log.PopLogFolder();
}

// ------ OpenNoah4AndLoadClients ------
// Open Noah4, delete all existing clients and import Noah client file
// @param {NhaxFileName} Filename for Noah client
function OpenNoah4AndLoadClients(NhaxFileName)
{
  Log.AppendFolder(unitName + "OpenNoah4AndLoadClients");
  Project.Variables.NhaxFileName = NhaxFileName;
  
  G_Util.InitForGenie();
  
  // For handling re entrance of importing clients
  // Must be reset after use.
  if(!Project.Variables.Sys_ToggleOpenState) 
  {
    Noah4.OpenMaximized();
    Noah4.DeleteAllClients(); // Deleting Clients if any present in database.
    Project.Variables.Sys_ToggleOpenState = false; 
  }
 
  Noah4.ImportAllClientInFile() 

  Log.PopLogFolder();
}

// ------ OpenNoah4AndLoadClients ------
// Actions to be taken to get at te same point like OpenGenieAndLoadNoahClients in Standalone
// @param {NhaxFileName} Filename for Noah client
function OpenNoah4AndLoadClientsPostActions()
{
  Log.AppendFolder(unitName + "OpenNoah4AndLoadClientsPostActions");

  Noah4.SelectTheClient();
  Noah4.StartGenieSession();
  Delay(10000);
  Noah4.v_StartGenieSession();
  G_App.v_Open();
  Aliases.GenieApp.Maximize();

  Log.PopLogFolder();
}
