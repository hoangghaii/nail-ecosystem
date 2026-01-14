#!/bin/bash

# API endpoint testing script for search/filter migration
# Tests real endpoints with various query parameters

API_URL="http://localhost:3000"
ADMIN_EMAIL="admin@nailsalon.com"
ADMIN_PASSWORD="Admin123!@#"

echo "=========================================="
echo "Backend Search/Filter API Testing"
echo "=========================================="
echo ""

# Get auth token
echo "1. Getting auth token..."
TOKEN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "   ❌ Failed to get auth token. Response: $TOKEN_RESPONSE"
  echo "   Note: Admin user may not exist. This is expected in fresh environment."
  echo ""
  echo "   Continuing with public endpoints only..."
  echo ""
  HAS_AUTH=false
else
  echo "   ✅ Token obtained successfully"
  echo ""
  HAS_AUTH=true
fi

# Test bookings endpoints (protected)
if [ "$HAS_AUTH" = true ]; then
  echo "=========================================="
  echo "2. BOOKINGS ENDPOINTS"
  echo "=========================================="
  echo ""

  echo "2.1 Test: GET /bookings (no filters)"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/bookings" \
    -H "Authorization: Bearer $TOKEN")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)

  if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Status: $HTTP_CODE"
    echo "   Response contains: $(echo $BODY | grep -o '"data":\[' | head -1)"
  else
    echo "   ❌ Status: $HTTP_CODE"
    echo "   Body: $BODY"
  fi
  echo ""

  echo "2.2 Test: GET /bookings?status=pending"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/bookings?status=pending" \
    -H "Authorization: Bearer $TOKEN")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)

  if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Status: $HTTP_CODE"
  else
    echo "   ❌ Status: $HTTP_CODE"
    echo "   Body: $BODY"
  fi
  echo ""

  echo "2.3 Test: GET /bookings?search=john"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/bookings?search=john" \
    -H "Authorization: Bearer $TOKEN")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)

  if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Status: $HTTP_CODE"
  else
    echo "   ❌ Status: $HTTP_CODE"
    echo "   Body: $BODY"
  fi
  echo ""

  echo "2.4 Test: GET /bookings?sortBy=date&sortOrder=desc"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/bookings?sortBy=date&sortOrder=desc" \
    -H "Authorization: Bearer $TOKEN")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)

  if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Status: $HTTP_CODE"
  else
    echo "   ❌ Status: $HTTP_CODE"
    echo "   Body: $BODY"
  fi
  echo ""

  echo "2.5 Test: GET /bookings?status=pending&search=test&sortBy=createdAt&sortOrder=asc"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/bookings?status=pending&search=test&sortBy=createdAt&sortOrder=asc" \
    -H "Authorization: Bearer $TOKEN")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)

  if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Status: $HTTP_CODE (combined filters)"
  else
    echo "   ❌ Status: $HTTP_CODE"
    echo "   Body: $BODY"
  fi
  echo ""

  echo "2.6 Test: GET /bookings?sortBy=customerName&sortOrder=asc"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/bookings?sortBy=customerName&sortOrder=asc" \
    -H "Authorization: Bearer $TOKEN")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)

  if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Status: $HTTP_CODE (sort by customerName)"
  else
    echo "   ❌ Status: $HTTP_CODE"
    echo "   Body: $BODY"
  fi
  echo ""

  echo "=========================================="
  echo "3. CONTACTS ENDPOINTS"
  echo "=========================================="
  echo ""

  echo "3.1 Test: GET /contacts (no filters)"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/contacts" \
    -H "Authorization: Bearer $TOKEN")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)

  if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Status: $HTTP_CODE"
  else
    echo "   ❌ Status: $HTTP_CODE"
    echo "   Body: $BODY"
  fi
  echo ""

  echo "3.2 Test: GET /contacts?status=new"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/contacts?status=new" \
    -H "Authorization: Bearer $TOKEN")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)

  if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Status: $HTTP_CODE"
  else
    echo "   ❌ Status: $HTTP_CODE"
    echo "   Body: $BODY"
  fi
  echo ""

  echo "3.3 Test: GET /contacts?search=inquiry"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/contacts?search=inquiry" \
    -H "Authorization: Bearer $TOKEN")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)

  if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Status: $HTTP_CODE"
  else
    echo "   ❌ Status: $HTTP_CODE"
    echo "   Body: $BODY"
  fi
  echo ""

  echo "3.4 Test: GET /contacts?sortBy=name&sortOrder=asc"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/contacts?sortBy=name&sortOrder=asc" \
    -H "Authorization: Bearer $TOKEN")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)

  if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Status: $HTTP_CODE"
  else
    echo "   ❌ Status: $HTTP_CODE"
    echo "   Body: $BODY"
  fi
  echo ""

  echo "3.5 Test: GET /contacts?status=new&search=test&sortBy=createdAt&sortOrder=desc"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/contacts?status=new&search=test&sortBy=createdAt&sortOrder=desc" \
    -H "Authorization: Bearer $TOKEN")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)

  if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Status: $HTTP_CODE (combined filters)"
  else
    echo "   ❌ Status: $HTTP_CODE"
    echo "   Body: $BODY"
  fi
  echo ""
else
  echo "Skipping protected endpoints (no auth token)"
  echo ""
fi

echo "=========================================="
echo "4. EDGE CASES & ERROR HANDLING"
echo "=========================================="
echo ""

if [ "$HAS_AUTH" = true ]; then
  echo "4.1 Test: Invalid sortBy value"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/bookings?sortBy=invalidField" \
    -H "Authorization: Bearer $TOKEN")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)

  if [ "$HTTP_CODE" = "400" ]; then
    echo "   ✅ Status: $HTTP_CODE (correctly rejected)"
  else
    echo "   ❌ Status: $HTTP_CODE (expected 400)"
    echo "   Body: $BODY"
  fi
  echo ""

  echo "4.2 Test: Invalid sortOrder value"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/bookings?sortOrder=invalid" \
    -H "Authorization: Bearer $TOKEN")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)

  if [ "$HTTP_CODE" = "400" ]; then
    echo "   ✅ Status: $HTTP_CODE (correctly rejected)"
  else
    echo "   ❌ Status: $HTTP_CODE (expected 400)"
    echo "   Body: $BODY"
  fi
  echo ""

  echo "4.3 Test: Empty search string (should work)"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/bookings?search=" \
    -H "Authorization: Bearer $TOKEN")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)

  if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Status: $HTTP_CODE (empty search accepted)"
  else
    echo "   ❌ Status: $HTTP_CODE"
    echo "   Body: $BODY"
  fi
  echo ""

  echo "4.4 Test: Special characters in search"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/bookings?search=john.doe%40example.com" \
    -H "Authorization: Bearer $TOKEN")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)

  if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Status: $HTTP_CODE (special chars handled)"
  else
    echo "   ❌ Status: $HTTP_CODE"
    echo "   Body: $BODY"
  fi
  echo ""

  echo "4.5 Test: SQL injection attempt (should be safe)"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/bookings?search=';%20DROP%20TABLE%20bookings;--" \
    -H "Authorization: Bearer $TOKEN")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)

  if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Status: $HTTP_CODE (injection attempt safely handled)"
  else
    echo "   ❌ Status: $HTTP_CODE"
    echo "   Body: $BODY"
  fi
  echo ""
fi

echo "=========================================="
echo "5. BACKWARD COMPATIBILITY"
echo "=========================================="
echo ""

echo "5.1 Test: Health endpoint (public)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/health")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
  echo "   ✅ Status: $HTTP_CODE"
  echo "   Response: $BODY"
else
  echo "   ❌ Status: $HTTP_CODE"
  echo "   Body: $BODY"
fi
echo ""

echo "=========================================="
echo "Testing Complete!"
echo "=========================================="
