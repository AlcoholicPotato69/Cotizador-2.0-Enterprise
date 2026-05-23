@echo off
echo Starting PocketBase Backend...
cd "%~dp0..\backend"
if not exist pb_data mkdir pb_data
.\pocketbase.exe serve
pause
