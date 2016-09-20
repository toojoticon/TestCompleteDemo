//USEUNIT Lib_Automation

function RunTestCmd() {
  
 var fileName = ProcessCommandLine();
 Log.Message("File to open: "+fileName);
 RunTestFromFile(fileName);
}

function RunTestFromFile(fileName) {
 
  var sFolder = "c:\\Users\\dtc\\Documents\\TestComplete 12 Projects\\Demo1\\TestProject1\\Script\\";
  var definitionfilename = sFolder + fileName;
  var tcddtfile = aqFile.OpenTextFile(definitionfilename, aqFile.faRead, aqFile.ctANSI);

  //Copied from 468 in DSL_Exe
  while (!tcddtfile.IsEndOfFile())
  {
      unitMethodName = tcddtfile.ReadLine();
      Log.Message(unitMethodName);
      var res = 0;       
      res =  aqString.Find(unitMethodName,"//");
      if (unitMethodName != "" && res == -1) 
      {
        unitMethodName = aqString.Replace(unitMethodName, "();", "");
        Runner.CallMethod(unitMethodName);
      }
  }
}