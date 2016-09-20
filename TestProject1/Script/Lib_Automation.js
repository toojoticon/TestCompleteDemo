/**
Authors: TOOJ 
Date created: 2016-09-20
Description: 
Library supporting automation. Functions not related to the product under test. 
Operations on operating system, file system, logging.

*/

function killProcess(processName) {
  //Check if process exists
  if (Sys.WaitProcess(processName).Exists) 
  {
    var process = Sys.Process(processName);
    process.Close();
  }
  //Check if process was closed properly
  if (Sys.WaitProcess(processName).Exists) 
  {
    var process = Sys.Process(processName);
    process.Terminate();
  }
}

function ProcessCommandLine()
{
  var i;
                       
  for(i = 1; i <= BuiltIn.ParamCount(); i++) 
  {
    Log.Message("Processing parameter: "+BuiltIn.ParamStr(i));
    var fileName = ProcessCommandLineArgument(BuiltIn.ParamStr(i));
    if (fileName!=null) return fileName; 
  }
}

function ProcessCommandLineArgument(arg)
{
  var items;
  
  items = arg.split("=");
  if(items.length != 2) 
  {
    return;
  } 
  
  switch(aqString.ToLower(aqString.Trim(items[0]))) 
  {
    case "testfile":
      var fileName = aqString.Trim(items[1]);
      Log.Message("The 'testFile' argument is found! The value is '" 
        + fileName + "'");
      break; 
  }
  return fileName;
  
}

function Click(object, message) {
  Log.AppendFolder("Click: "+message);
  object.Click();
  Log.Message("Object " + message + " clicked");
  Log.Picture(Sys.Desktop.ActiveWindow(), "Take the screenshot");
  Log.PopLogFolder();
}

function ClickIfExists(object, message) {

  var exists = object.Exists;
  if (exists) {
    Click(object, " [optional] " + message);
  }
}

function CheckIfExists(object, message) {
  Log.AppendFolder("Check if object " + message + " exists");
  Log.Picture(Sys.Desktop.ActiveWindow(), "Take the screenshot");
  aqObject.CheckProperty(object, "Exists", cmpEqual, true)
  Log.PopLogFolder();
}