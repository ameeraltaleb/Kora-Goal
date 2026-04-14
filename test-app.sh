#!/bin/bash

# 🧪 Kora Goal - Comprehensive Testing Script
# This script verifies all components are working correctly

echo "⚽ Kora Goal - Application Verification"
echo "======================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to check test result
check_test() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $2"
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo -e "${RED}✗${NC} $2"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
}

# 1. Check Node.js installation
echo "📋 Checking prerequisites..."
node --version > /dev/null 2>&1
check_test $? "Node.js installed"

npm --version > /dev/null 2>&1
check_test $? "npm installed"

echo ""

# 2. Check required files exist
echo "📁 Checking required files..."
test -f "package.json"
check_test $? "package.json exists"

test -f ".env.local"
check_test $? ".env.local exists"

test -f "supabase_schema.sql"
check_test $? "supabase_schema.sql exists"

test -f "vercel.json"
check_test $? "vercel.json exists"

echo ""

# 3. Check environment variables
echo "🔐 Checking environment configuration..."
if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
  echo -e "${GREEN}✓${NC} NEXT_PUBLIC_SUPABASE_URL configured"
  TESTS_PASSED=$((TESTS_PASSED + 1))
else
  echo -e "${YELLOW}⚠${NC} NEXT_PUBLIC_SUPABASE_URL not set (using placeholder)"
fi

if grep -q "GEMINI_API_KEY" .env.local; then
  echo -e "${GREEN}✓${NC} GEMINI_API_KEY configured"
  TESTS_PASSED=$((TESTS_PASSED + 1))
else
  echo -e "${RED}✗${NC} GEMINI_API_KEY not set"
  TESTS_FAILED=$((TESTS_FAILED + 1))
fi

echo ""

# 4. Install dependencies if needed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
  check_test $? "Dependencies installed"
else
  echo -e "${GREEN}✓${NC} node_modules exists"
  TESTS_PASSED=$((TESTS_PASSED + 1))
fi

echo ""

# 5. Run TypeScript type checking
echo "🔍 Running type checks..."
npx tsc --noEmit > /dev/null 2>&1
check_test $? "TypeScript type checking passed"

echo ""

# 6. Run linter
echo "🧹 Running linter..."
npm run lint > /dev/null 2>&1
check_test $? "ESLint passed"

echo ""

# 7. Test build
echo "🏗️  Testing build..."
npm run build > /dev/null 2>&1
check_test $? "Build successful"

echo ""

# 8. Check critical components
echo "🧩 Checking critical components..."
test -f "src/app/page.tsx"
check_test $? "Home page component exists"

test -f "src/app/api/matches/route.ts"
check_test $? "Matches API route exists"

test -f "src/lib/supabase.ts"
check_test $? "Supabase client exists"

test -f "src/components/VideoPlayer.tsx"
check_test $? "VideoPlayer component exists"

test -f "src/app/admin/page.tsx"
check_test $? "Admin dashboard exists"

echo ""

# 9. Check API routes
echo "🔌 Checking API routes..."
test -f "src/app/api/cron/fetch-matches/route.ts"
check_test $? "Fetch matches cron job exists"

test -f "src/app/api/cron/fetch-news/route.ts"
check_test $? "Fetch news cron job exists"

test -f "src/app/api/cron/fetch-standings/route.ts"
check_test $? "Fetch standings cron job exists"

test -f "src/app/api/cron/update-status/route.ts"
check_test $? "Update status cron job exists"

test -f "src/app/api/admin/dashboard/route.ts"
check_test $? "Admin dashboard API exists"

echo ""

# Summary
echo "======================================="
echo "📊 Test Summary:"
echo -e "  ${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "  ${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed! Application is ready.${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Configure your Supabase credentials in .env.local"
  echo "2. Run: npm run dev"
  echo "3. Visit: http://localhost:3000"
  echo "4. Initialize database with supabase_schema.sql"
  echo "5. Trigger cron jobs manually to fetch initial data"
  exit 0
else
  echo -e "${RED}❌ Some tests failed. Please fix the issues above.${NC}"
  exit 1
fi
