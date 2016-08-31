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
  Log.AppendFolder(message);
  object.Click();
  Log.Message("Object clicked");
  Log.Picture(Sys.Desktop.ActiveWindow(), "Take the screenshot");
  Log.PopLogFolder();
}