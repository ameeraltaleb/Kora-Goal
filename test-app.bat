@echo off
REM 🧪 Kora Goal - Windows Testing Script

echo =======================================
echo ⚽ Kora Goal - Application Verification
echo =======================================
echo.

set TESTS_PASSED=0
set TESTS_FAILED=0

REM Check Node.js
echo 📋 Checking prerequisites...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Node.js installed
    set /a TESTS_PASSED+=1
) else (
    echo [✗] Node.js not installed
    set /a TESTS_FAILED+=1
)

npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] npm installed
    set /a TESTS_PASSED+=1
) else (
    echo [✗] npm not installed
    set /a TESTS_FAILED+=1
)
echo.

REM Check files
echo 📁 Checking required files...
if exist "package.json" (
    echo [✓] package.json exists
    set /a TESTS_PASSED+=1
) else (
    echo [✗] package.json missing
    set /a TESTS_FAILED+=1
)

if exist ".env.local" (
    echo [✓] .env.local exists
    set /a TESTS_PASSED+=1
) else (
    echo [✗] .env.local missing
    set /a TESTS_FAILED+=1
)

if exist "supabase_schema.sql" (
    echo [✓] supabase_schema.sql exists
    set /a TESTS_PASSED+=1
) else (
    echo [✗] supabase_schema.sql missing
    set /a TESTS_FAILED+=1
)
echo.

REM Check dependencies
echo 📦 Checking dependencies...
if exist "node_modules" (
    echo [✓] node_modules exists
    set /a TESTS_PASSED+=1
) else (
    echo [!] node_modules not found. Run: npm install
)
echo.

REM Check critical files
echo 🧩 Checking critical components...
if exist "src\app\page.tsx" (
    echo [✓] Home page exists
    set /a TESTS_PASSED+=1
) else (
    echo [✗] Home page missing
    set /a TESTS_FAILED+=1
)

if exist "src\app\api\matches\route.ts" (
    echo [✓] Matches API exists
    set /a TESTS_PASSED+=1
) else (
    echo [✗] Matches API missing
    set /a TESTS_FAILED+=1
)

if exist "src\lib\supabase.ts" (
    echo [✓] Supabase client exists
    set /a TESTS_PASSED+=1
) else (
    echo [✗] Supabase client missing
    set /a TESTS_FAILED+=1
)

if exist "src\components\VideoPlayer.tsx" (
    echo [✓] VideoPlayer exists
    set /a TESTS_PASSED+=1
) else (
    echo [✗] VideoPlayer missing
    set /a TESTS_FAILED+=1
)

if exist "src\app\admin\page.tsx" (
    echo [✓] Admin dashboard exists
    set /a TESTS_PASSED+=1
) else (
    echo [✗] Admin dashboard missing
    set /a TESTS_FAILED+=1
)
echo.

REM Summary
echo =======================================
echo 📊 Test Summary:
echo   Passed: %TESTS_PASSED%
echo   Failed: %TESTS_FAILED%
echo.

if %TESTS_FAILED% equ 0 (
    echo ✅ All tests passed! Application is ready.
    echo.
    echo Next steps:
    echo 1. Configure Supabase credentials in .env.local
    echo 2. Run: npm run dev
    echo 3. Visit: http://localhost:3000
    echo 4. Initialize database with supabase_schema.sql
    echo 5. Trigger cron jobs to fetch initial data
) else (
    echo ❌ Some tests failed. Please fix the issues above.
)
echo.

pause
