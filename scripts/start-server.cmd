@echo off
cd /d "%~dp0\.."
"C:\Program Files\nodejs\node.exe" "dist\api\apps\api\src\main.js" > "dev-server.log" 2> "dev-server.err.log"
