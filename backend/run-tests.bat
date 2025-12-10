@echo off
echo Running backend tests...
cd /d "%~dp0"
call npm test
pause
