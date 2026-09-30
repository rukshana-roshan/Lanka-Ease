@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------

@if "%DEBUG%"=="" @echo off
@setlocal

set ERROR_CODE=0

@set MAVEN_PROJECTBASEDIR=%~dp0
if "%MAVEN_PROJECTBASEDIR%"=="" set MAVEN_PROJECTBASEDIR=.

set MAVEN_CMD_LINE_ARGS=%*

@REM Find java.exe
if not "%JAVA_HOME%"=="" goto setJavaHome
set JAVA_EXE=java.exe
goto checkJava

:setJavaHome
set JAVA_EXE=%JAVA_HOME%\bin\java.exe

:checkJava
if exist "%JAVA_EXE%" goto init

echo.
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
echo.
goto error

:init
set WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

%JAVA_EXE% -jar %WRAPPER_JAR% %MAVEN_CMD_LINE_ARGS%
goto end

:error
set ERROR_CODE=1

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%
exit /B %ERROR_CODE%
