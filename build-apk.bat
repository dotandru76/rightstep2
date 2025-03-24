
@echo off
echo Building APK for water-balance-journey...
echo.

rem Build the web app
echo Step 1: Building web app...
call npm run build
if %ERRORLEVEL% neq 0 (
  echo Error building web app.
  exit /b %ERRORLEVEL%
)

rem Sync with Capacitor
echo Step 2: Syncing with Capacitor...
call npx cap sync android
if %ERRORLEVEL% neq 0 (
  echo Error syncing with Capacitor.
  exit /b %ERRORLEVEL%
)

rem Build the APK
echo Step 3: Building APK...
cd android
call gradlew assembleDebug
if %ERRORLEVEL% neq 0 (
  echo Error building APK.
  exit /b %ERRORLEVEL%
)

echo.
echo APK build complete!
echo.
echo Your APK file should be located at:
echo android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo You can install this APK on your Android device.
cd ..
pause
