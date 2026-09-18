@echo off
echo ===================================================
echo   Pushing FarmSync to GitHub Repository
echo   https://github.com/swaroopgade2006/farmsync-smart-agri
echo ===================================================
echo.

set "GIT_CMD=%LOCALAPPDATA%\Programs\MinGit\cmd\git.exe"

if exist "%GIT_CMD%" (
    "%GIT_CMD%" push -u origin main
) else (
    git push -u origin main
)

echo.
echo ===================================================
echo   Push completed!
echo ===================================================
pause
