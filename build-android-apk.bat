
@echo off
echo ===================================
echo Building Water Balance Journey APK
echo ===================================
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: npm is not installed or not in your PATH
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

REM Check if Java is installed
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Java is not installed or not in your PATH
    echo Please install Java JDK from https://adoptium.net/
    exit /b 1
)

echo 1. Building the web app...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Failed to build the web app
    exit /b 1
)

echo 2. Syncing with Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo Error: Failed to sync with Capacitor
    exit /b 1
)

echo 3. Adding Android platform if not exists...
if not exist android (
    call npx cap add android
    if %errorlevel% neq 0 (
        echo Error: Failed to add Android platform
        exit /b 1
    )
)

echo 4. Checking for Android SDK...
set "ANDROID_SDK_ROOT="

REM Try to locate Android SDK from common locations
if exist "%LOCALAPPDATA%\Android\Sdk" (
    set "ANDROID_SDK_ROOT=%LOCALAPPDATA%\Android\Sdk"
) else if exist "%USERPROFILE%\AppData\Local\Android\Sdk" (
    set "ANDROID_SDK_ROOT=%USERPROFILE%\AppData\Local\Android\Sdk"
) else if exist "C:\Android\Sdk" (
    set "ANDROID_SDK_ROOT=C:\Android\Sdk"
)

if "%ANDROID_SDK_ROOT%"=="" (
    echo Error: Android SDK not found
    echo Please download Android Command Line Tools from:
    echo https://developer.android.com/studio#command-tools
    echo And set ANDROID_SDK_ROOT environment variable
    exit /b 1
)

echo Using Android SDK at: %ANDROID_SDK_ROOT%

echo 5. Using Gradle to build APK...
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo Error: Failed to build APK with Gradle
    cd ..
    exit /b 1
)
cd ..

echo.
echo ===========================================
echo Build completed!
echo.
echo Your APK can be found at:
echo android\app\build\outputs\apk\debug\app-debug.apk
echo ===========================================
echo.
echo You can install this APK on your Android device by:
echo 1. Transferring the file to your device
echo 2. On your device, navigate to the APK file
echo 3. Tap on it and follow the installation prompts
echo.
echo Note: You may need to enable "Install from Unknown Sources"
echo in your device's security settings.
echo ===========================================

pause
