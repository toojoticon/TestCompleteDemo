set testcomplete="c:\Program Files\SmartBear\TestComplete 12\Bin\TestComplete.exe"
set project="c:\Users\dtc\Documents\TestComplete 12 Projects\Demo1\TestProject1\TestProject1.mds"

%testcomplete% %project% /run /project:TestProject1 /unit:Test_Runner /routine:RunTestCmd "testFile=testName.txt"

