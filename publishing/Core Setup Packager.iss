; SEE THE DOCUMENTATION FOR DETAILS ON CREATING INNO SETUP SCRIPT FILES!         
;#dim KeepFiles[3]
;#define KeepFiles[0] 'AppSettingDB.db'
;#define KeepFiles[1] 'DeviceDB.db'      
;#define KeepFiles[2] 'Layout.db'
;#define I    

#define MyDateTimeString GetDateTimeString('yyyymmdd', '', '');
[Setup]
; NOTE: The value of AppId uniquely identifies this application.
; Do not use the same AppId value in installers for other applications.
; (To generate a new GUID, click Tools | Generate GUID inside the IDE.)
AppId={{A717F79A-3E09-4441-B378-86CE25CD64C3}}
AppName={cm:MyAppName}
AppVerName={cm:MyAppVerName}
AppPublisher=Glorious, LLC
AppPublisherURL=https://www.gloriousgaming.com/
AppSupportURL=https://www.gloriousgaming.com/pages/support
AppUpdatesURL=
DefaultDirName={pf}\{cm:GroupName}
DefaultGroupName=Glorious Core
OutputBaseFilename=GloriousCore[replace-with-version]_Setup
Compression=lzma
SolidCompression=true
AppendDefaultGroupName=false
SetupIconFile=files\Icon.ico
UninstallDisplayIcon={app}\Icon.ico
LicenseFile=files\license.txt
UninstallFilesDir={win}
WizardImageStretch=false
DirExistsWarning=no
ShowLanguageDialog=yes 
OutputDir=setup
AlwaysRestart=false
;SignTool=mssigntool
                                                     
[Languages]
Name: en; MessagesFile: compiler:\Default.isl
[Messages]
;en.BeveledLabel=English 

[CustomMessages]               
en.MyAppVerName=Glorious CORE
en.MyAppName=Glorious CORE
en.GroupName=Glorious CORE
en.RunConfig=Glorious CORE
en.Help=Help  
en.warning=Warning!
en.exist1=An old version of AP is detected. Please uninstall it.
en.Device=Do NOT Find Gaming Keyboard!

;for Check Delet appdata file
en.CheckDeletCaption=Are you sure to remove the existing configuration files?
en.CheckDeletRadioYes=Yes
en.CheckDeletRadioNo=No
en.CheckDeletUninstallBtn=Uninstall
  
[Files]
; NOTE: Don't use "Flags: ignoreversion" on any shared system files   
Source: files\*; DestDir: {app};Flags: recursesubdirs  ignoreversion;       
Source: DllSDK\*; DestDir: {app}\DllSDK;Flags: recursesubdirs  ignoreversion;  
;Source: "AppDataFiles\*"; DestDir: {userappdata}\Glorious Core\; Flags: recursesubdirs ignoreversion createallsubdirs;      
;Source: "AppDataFiles\*"; DestDir: {commonappdata}\Glorious Core\; Permissions: everyone-full; Flags: recursesubdirs ignoreversion createallsubdirs ;     
;Source: FWUpdate\*; DestDir: {app}\FWUpdate; Flags: recursesubdirs ignoreversion createallsubdirs   

[Registry]                                                                                                                                                              
Root: HKLM; Subkey: SOFTWARE\Microsoft\Windows\CurrentVersion\Run; ValueType: string; ValueName:Glorious Core; ValueData: {app}\Glorious Core.exe --hide; Flags: uninsdeletevalue
;Root: HKLM; Subkey: SOFTWARE\Microsoft\Windows\CurrentVersion\Run; ValueType: string; ValueName:Tesoro G11TKL; ValueData: {app}\G11TKL\App_G11TKL.exe; Flags: uninsdeletevalue

[Icons]
Name: {group}\{cm:UninstallProgram, }; Filename: {uninstallexe}  
Name: {commondesktop}\{cm:RunConfig}; Filename: {app}\Glorious Core.exe

[Run]           
                                                               
Filename: {app}\Glorious Core.exe; Parameters:--forcehide; Flags: nowait skipifsilent runasoriginaluser hidewizard;   
Filename: {app}\Glorious Core.exe; Description: {cm:RunConfig}; Flags: nowait postinstall skipifsilent runasoriginaluser;

[Code] 

var
HasRun:HWND;
ResultCode: Integer;
LastUninstallString: String;  
   
procedure TaskKill(FileName: String);
var
  ResultCode: Integer;
begin
    Exec(ExpandConstant('taskkill.exe'), '/t /f /im ' + '"' + FileName + '"', '', SW_HIDE,ewWaitUntilTerminated, ResultCode);
end;

function CloseApp() : Boolean;
begin
  TaskKill('Glorious Core.exe');
  Result := true;
end;

function InitializeSetup(): Boolean;
begin 
  Result := true;    
  CloseApp();   

// if RegQueryStringValue(HKEY_LOCAL_MACHINE, 'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{A717F79A-3E09-4441-B378-86CE25CD64C3}}_is1','UninstallString', LastUninstallString) then
//    begin
//      StringChangeEx(LastUninstallString, '"', '', True);
//      //Exec(LastUninstallString,'', '', SW_SHOW,ewNoWait, ResultCode);
//
//      Exec(LastUninstallString,'', '', SW_SHOW,ewNoWait, ResultCode);
//      Result := false;
//
//    end
// else
//    begin             
//      Result := true;
//    end
end;     

function InitializeUninstall(): Boolean;
begin        
  Result := CloseApp();

end;

function GetUninstallString(): String;
var
  sUnInstPath: String;
  sUnInstallString: String;
begin
  sUnInstPath := ExpandConstant('Software\Microsoft\Windows\CurrentVersion\Uninstall\{#emit SetupSetting("AppId")}_is1');
  sUnInstallString := '';
  if not RegQueryStringValue(HKLM, sUnInstPath, 'UninstallString', sUnInstallString) then
    RegQueryStringValue(HKCU, sUnInstPath, 'UninstallString', sUnInstallString);
  Result := sUnInstallString;
end;

function IsUpgrade(): Boolean;
begin
  Result := (GetUninstallString() <> '');
end;

function UnInstallOldVersion(): Integer;
var
  sUnInstallString: String;
  iResultCode: Integer;
begin
// Return Values:
// 1 - uninstall string is empty
// 2 - error executing the UnInstallString
// 3 - successfully executed the UnInstallString

  // default return value
  Result := 0;

  // get the uninstall string of the old app
  sUnInstallString := GetUninstallString();
  if sUnInstallString <> '' then begin
    sUnInstallString := RemoveQuotes(sUnInstallString);
    //if Exec(sUnInstallString, '/SILENT /NORESTART /SUPPRESSMSGBOXES','', SW_HIDE, ewWaitUntilTerminated, iResultCode) then
    //if ShellExec('',sUnInstallString, '/SILENT /NORESTART /SUPPRESSMSGBOXES','', SW_HIDE, ewWaitUntilTerminated, iResultCode) then
    if ShellExec('',sUnInstallString, '/VERYSILENT /NORESTART /SUPPRESSMSGBOXES','', SW_HIDE, ewWaitUntilTerminated, iResultCode) then
      Result := 3
    else
      Result := 2;
  end else
    Result := 1;
end;

//Add
var  
  DataDeletCheckPage: TNewNotebookPage;
  UninstallNextButton: TNewButton;  
  YesRadioButton, NoRadioButton: TNewRadioButton;

function AddUninstallPage(): Boolean;  
var  
  PageText: TNewStaticText;

  //temp setting
  PageNameLabel: string;
  PageDescriptionLabel: string;
  CancelButtonEnabled: Boolean;
  CancelButtonModalResult: Integer;
begin
  //Create page
  DataDeletCheckPage := TNewNotebookPage.Create(UninstallProgressForm);
  DataDeletCheckPage.Notebook := UninstallProgressForm.InnerNotebook;
  DataDeletCheckPage.Parent := UninstallProgressForm.InnerNotebook;
  DataDeletCheckPage.Align := alClient;
  
  PageText := TNewStaticText.Create(UninstallProgressForm);
  PageText.Parent := DataDeletCheckPage;
  PageText.Top := UninstallProgressForm.StatusLabel.Top;
  PageText.Left := UninstallProgressForm.StatusLabel.Left;
  PageText.Width := UninstallProgressForm.StatusLabel.Width;
  PageText.Height := UninstallProgressForm.StatusLabel.Height;
  PageText.AutoSize := False;
  PageText.ShowAccelChar := False;
  PageText.Caption := CustomMessage('CheckDeletCaption');

  //change current page
  UninstallProgressForm.InnerNotebook.ActivePage := DataDeletCheckPage;
  PageNameLabel := UninstallProgressForm.PageNameLabel.Caption;
  PageDescriptionLabel := UninstallProgressForm.PageDescriptionLabel.Caption;

  //Create button
  UninstallNextButton := TNewButton.Create(UninstallProgressForm);
  UninstallNextButton.Parent := UninstallProgressForm;
  UninstallNextButton.Left :=
    UninstallProgressForm.CancelButton.Left -
    UninstallProgressForm.CancelButton.Width -
    ScaleX(10);
  UninstallNextButton.Top := UninstallProgressForm.CancelButton.Top;
  UninstallNextButton.Width := UninstallProgressForm.CancelButton.Width;
  UninstallNextButton.Height := UninstallProgressForm.CancelButton.Height;
  //UninstallNextButton.OnClick := @UninstallNextButtonClick;
  UninstallNextButton.Caption := CustomMessage('CheckDeletUninstallBtn');
  UninstallNextButton.ModalResult := mrOK; //mrNone;

  YesRadioButton := TNewRadioButton.Create(UninstallProgressForm);
  YesRadioButton.Parent := UninstallProgressForm;
  YesRadioButton.Caption := CustomMessage('CheckDeletRadioYes');
  YesRadioButton.Top := UninstallProgressForm.StatusLabel.Top + ScaleX(90);  
  YesRadioButton.Left := UninstallProgressForm.StatusLabel.Left;
  YesRadioButton.Checked := True;
 
  NoRadioButton := TNewRadioButton.Create(UninstallProgressForm);
  NoRadioButton.Parent := UninstallProgressForm;
  NoRadioButton.Caption := CustomMessage('CheckDeletRadioNo');
  NoRadioButton.Top:= YesRadioButton.Top + YesRadioButton.Height + ScaleX(10);
  NoRadioButton.Left := YesRadioButton.Left;
  
  //button TabOrder
  UninstallProgressForm.CancelButton.TabOrder := UninstallNextButton.TabOrder + 1;

  CancelButtonEnabled := UninstallProgressForm.CancelButton.Enabled
  UninstallProgressForm.CancelButton.Enabled := True;
  CancelButtonModalResult := UninstallProgressForm.CancelButton.ModalResult;
  UninstallProgressForm.CancelButton.ModalResult := mrCancel;


  //wait mrOK to continue
  if UninstallProgressForm.ShowModal = mrCancel then Abort;

  //return Form setting

  UninstallProgressForm.CancelButton.Enabled := CancelButtonEnabled;
  UninstallProgressForm.CancelButton.ModalResult := CancelButtonModalResult;
  UninstallProgressForm.PageNameLabel.Caption := PageNameLabel;
  UninstallProgressForm.PageDescriptionLabel.Caption := PageDescriptionLabel;
  UninstallProgressForm.InnerNotebook.ActivePage :=  UninstallProgressForm.InstallingPage;

  UninstallNextButton.Visible := False;
  YesRadioButton.Visible := False;
  NoRadioButton.Visible := False;

  if(YesRadioButton.Checked = True) then begin
	  Result := True;
  end else begin
	  Result := False;
  end;
end;

/////////////////////////////////////////////////////////////////
//CopyDirectory    
//If need to keep result true 
//function CheckFileName(name:string): boolean;
//var
//  KeepName : Array of string;
//  FileNum, i : Integer;
//begin    
//  FileNum := {#DimOf(KeepFiles)};
//  SetLength(KeepName, FileNum);   
//  #sub NameArray  
//    KeepName[{#I}]:= '{#KeepFiles[I]}';
//  #endsub                     
//  #for {I = 0; I < DimOf(KeepFiles); I++} NameArray        
//
//  Result := False; 
//
//  for i:=0 to High(KeepName) do begin  
//    if(KeepName[i]=name) then
//      Result := True;
//  end; 
//
//end;

//copy 2 exist Directory Source  to Dest

//function DirectoryCopy(SourcePath, DestPath: string; withoutFolder: boolean): boolean;
//var
//  FindRec: TFindRec;
//  SourceFilePath: string;
//  DestFilePath: string;
//begin    
//  if FindFirst(SourcePath + '\*', FindRec) then begin
//    try
//      repeat
//        if (FindRec.Name <> '.') and (FindRec.Name <> '..') then begin
//          SourceFilePath := SourcePath + '\' + FindRec.Name;
//          DestFilePath := DestPath + '\' + FindRec.Name;
//          if FindRec.Attributes and FILE_ATTRIBUTE_DIRECTORY = 0 then begin
//            //file
//            if CheckFileName(FindRec.Name)  then begin //add
//              if FileCopy(SourceFilePath, DestFilePath, False) then begin
//                Result := True;
//                //MsgBox('Copy Worked!', mbInformation, MB_OK);
//              end else begin
//                Result := False;
//                //MsgBox('Copy Failed!'+SourceFilePath, mbInformation, MB_OK);
//              end;
//            end;
//          end else if not withoutFolder then begin
//            if CreateDir(DestFilePath) then begin
//              Result := True;
//              //MsgBox('Created Dir!', mbInformation, MB_OK);
//              DirectoryCopy(SourceFilePath, DestFilePath, False);
//            end else begin
//              Result := False;
//              //MsgBox('Failed to create Dir!', mbInformation, MB_OK);
//            end;
//          end else begin //withoutFolder
//              Result := True;
//              DirectoryCopy(SourceFilePath, DestFilePath, True);
//          end;
//
//        end;
//      until not FindNext(FindRec);
//    finally
//      FindClose(FindRec);
//    end;
//  end else begin
//    Result := False;
//    //MsgBox('Failed to List!', mbInformation, MB_OK);
//  end;
//end;

function DirectoryDelet(SourcePath, KeepName: string): boolean;
var
  FindRec: TFindRec;
  SourceFilePath: string;
begin   

  if FindFirst(SourcePath + '\*', FindRec) then begin
    try
      repeat
        if (FindRec.Name <> '.') and (FindRec.Name <> '..') then begin
          SourceFilePath := SourcePath + '\' + FindRec.Name;
          if FindRec.Attributes and FILE_ATTRIBUTE_DIRECTORY = 0 then begin
            DeleteFile(SourceFilePath);
            Result := True;
          end else begin 
            Result := True;
            if not (FindRec.Name = KeepName) then
              DelTree(SourceFilePath, True, True, True);   
          end;
        end;
      until not FindNext(FindRec);
    finally
      FindClose(FindRec);
    end;
  end else begin
    Result := False;
    //MsgBox('Failed to List!', mbInformation, MB_OK);
  end;

end;

//procedure KeepFileDelet(Path : string); //Path: App datas path
//var    
//  TempPath, DataPath, TempDataPath : string;
//begin     
//  DirectoryDelet(Path,'userdata');
//
//  //DataPath :=Path+'\userdata';          //Path\userdata  
//  //TempPath :=Path+'_tmp';               //Path_tmp      
//  //TempDataPath :=TempPath+'\userdata';  //Path_tmp\userdata      
//
//  //DelTree(TempPath, True, True, True);     
//  //ForceDirectories(TempDataPath);      
//  //DirectoryCopy(DataPath, TempDataPath, False);
//         
//end;

//procedure CopyFileFromAppdataTemp(Path : string);
//var    
//  TempPath : string;
//begin
//  TempPath :=Path+'_tmp';   
//
//  DirectoryCopy(TempPath, Path, False);                //copy temp filder 
//  //DelTree(TempPath, True, True, True);                //delet temp filder
//end;

procedure CurStepChanged(CurStep : TSetupStep);
var  
  ProgramDataPath : string;
begin     
  if (CurStep = ssInstall) then begin                //安裝前   
    if (IsUpgrade()) then begin
      UnInstallOldVersion();
    end; 
  end else if (CurStep = ssPostInstall) then begin   //安裝完成  
    //ProgramDataPath :=ExpandConstant('{commonappdata}\Glorious Core');   
    //CopyFileFromAppdataTemp(ProgramDataPath);            //將tmp資料倒進appdata中
  end else if (CurStep = ssDone) then begin          //完成後程式關閉前 

  end;
end;

procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
begin         
  if (CurUninstallStep = usUninstall) then begin                  //反安裝前   
  end else if (CurUninstallStep = usPostUninstall) then begin     //反安裝完成    
  end else if (CurUninstallStep = usDone) then begin              //完成後程式關閉前    
  end;
end;

procedure InitializeUninstallProgressForm();
var    
  IsDeleteData : Boolean;
  AppDataPath, ProgramDataPath : string;
begin
  ProgramDataPath :=ExpandConstant('{commonappdata}\Glorious Core');  //取ProgramData路徑  

  if(UninstallSilent) then begin                                      //如過是靜默移除，則固定保留檔案
    DirectoryDelet(ProgramDataPath,'userdata');
  end else begin  
    IsDeleteData := AddUninstallPage();                               //呼叫自訂頁面 AddUninstallPage      

    if(IsDeleteData = False) then begin
      DirectoryDelet(ProgramDataPath,'userdata');
    end else begin  
      DelTree(ProgramDataPath, True, True, True);                     //移除ProgramData中的資料夾 
    end;
  end;  
end;