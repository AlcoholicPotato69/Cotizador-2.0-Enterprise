@echo off
echo Resetting Development Environment...
cd "%~dp0..\frontend"
npm run reset:dev
cd "%~dp0..\backend"
echo Done.
