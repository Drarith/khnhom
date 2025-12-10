@echo off
echo Running frontend tests...
cd /d "%~dp0"
call npm test
pause
