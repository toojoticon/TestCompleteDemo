//USEUNIT TcUtil
var unitName = "G_ClientListView."
var View = Aliases.GenieApp.ClientListView;

// The View scripts provide access to the very basic functions via the Aliases / NameMapping
//------ v_MappedItems() ---------------------------------------------------------------------------------------------------------------------------//
// Verifies mapped items are visible on screen function v_MappedItems() {
  Log.AppendFolder(unitName + "v_MappedItems");
  if (!Project.Variables.bVerifyMappedItems) return;

  aqObject.CheckProperty(View, "Visible", cmpEqual, Project.Variables.bStandalone);
  //View.RefreshMappingInfo(); // or Refresh results in same time 47 s anyway...

  aqObject.CheckProperty(View.ClientList, "Exists", cmpEqual, Project.Variables.bStandalone);
  //aqObject.CheckProperty(View.ClientList.FirstItemID, "Exists", cmpEqual, Project.Variables.bStandalone); //  aqObject.CheckProperty(View.DeleteSelected, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.FirstName, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.LastName, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.Referral, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.Physician, "Exists", cmpEqual, Project.Variables.bStandalone);
  //aqObject.CheckProperty(View.Detail.SaveChanges, "Exists", cmpEqual, Project.Variables.bStandalone);
  //aqObject.CheckProperty(View.Detail.DiscardChanges, "Exists", cmpEqual, Project.Variables.bStandalone); //  aqObject.CheckProperty(View.Detail.Cancel, "Exists", cmpEqual, Project.Variables.bStandalone); //  aqObject.CheckProperty(View.Detail.Toggle, "Exists", cmpEqual, Project.Variables.bStandalone);
  
  aqObject.CheckProperty(View.Detail.ClientID, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.Gender, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.Title, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.Address1, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.Address2, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.Address3, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.City, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.ZipCode, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.State, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.HomePhone, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.MobilePhone, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.WorkPhone, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.Fax, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.Email, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.SocialSecurity, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.Insurance1, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.Insurance1Number, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.Insurance2, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.Insurance2Number, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Detail.Comments, "Exists", cmpEqual, Project.Variables.bStandalone);
  
  
//  aqObject.CheckProperty(View.EditClient, "Exists", cmpEqual, Project.Variables.bStandalone); //  aqObject.CheckProperty(View.NewClient, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.SearchFor, "Exists", cmpEqual, Project.Variables.bStandalone);
  aqObject.CheckProperty(View.Search, "Exists", cmpEqual, Project.Variables.bStandalone);
  
  TcUtil.ListCommands(View);

  Log.PopLogFolder();
}



//------ v_SecondClientSelect() ---------------------------------------------------------------------------------------------------------------------------//
// Verifies that 2nd client is deselected.
function v_SecondClientSelect()
{
  Log.AppendFolder(unitName + "v_SecondClientSelect");
  aqObject.CheckProperty(View.ClientList.DataGridRow2.DataGridCell2, "IsSelected", cmpEqual, true);
  Log.PopLogFolder();
}
//------ SecondClientSelect() ---------------------------------------------------------------------------------------------------------------------------//
// Selects 2nd client.
function SecondClientSelect()
{
  Log.AppendFolder(unitName + "SecondClientSelect");
  View.ClientList.DataGridRow2.DataGridCell2.Click();
  if (Project.Variables.bSTP) v_SecondClientSelect();
  Log.PopLogFolder();
}

