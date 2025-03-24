
@echo off
echo Setting up Android SDK environment variables...

rem Set ANDROID_HOME environment variable
setx ANDROID_HOME "C:\Users\dotan_d\AppData\Local\Android\Sdk" /M
echo ANDROID_HOME environment variable set to C:\Users\dotan_d\AppData\Local\Android\Sdk

rem Add platform-tools to PATH
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools" /M
echo Added platform-tools to PATH

echo.
echo Setup complete! Please restart your Command Prompt to apply these changes.
echo After restarting, verify the setup by running:
echo    echo %%ANDROID_HOME%%
echo    adb --version
echo.
echo Then run the following commands for your Capacitor project:
echo    npm run build
echo    npx cap sync android
echo    npx cap open android
echo.
pause
