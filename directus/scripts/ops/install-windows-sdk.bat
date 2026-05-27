@echo off
echo ====================================================================
echo Fixing Node-GYP "missing any Windows SDK" error for isolated-vm
echo ====================================================================
echo Attempting to install Visual Studio Build Tools with Windows 11 SDK...
echo Make sure you run this script as Administrator.

winget install --id Microsoft.VisualStudio.2022.BuildTools --override "--passive --wait --add Microsoft.VisualStudio.Workload.VCTools --add Microsoft.VisualStudio.Component.Windows11SDK.22621"

if %ERRORLEVEL% neq 0 (
    echo Winget installation failed. Falling back to direct download...
    curl -sL -o vs_buildtools.exe "https://aka.ms/vs/17/release/vs_buildtools.exe"
    echo Running installer (this may take a while)...
    vs_buildtools.exe --passive --wait --norestart --nocache --add Microsoft.VisualStudio.Workload.VCTools --add Microsoft.VisualStudio.Component.Windows11SDK.22621
    del vs_buildtools.exe
)

echo.
echo ====================================================================
echo Installation attempt finished.
echo Please check for any errors above.
echo You may need to restart your terminal before running npm rebuild again.
echo ====================================================================
pause
