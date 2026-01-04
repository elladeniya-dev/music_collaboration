# 🧪 Testing Guide - JWT Cookie Authentication Fix

## Quick Start Test

### 1. Ensure Backend is Running
```bash
cd backend
mvnw spring-boot:run
# Should see: "Started BackendApplication in X seconds"
```

### 2. Ensure Frontend is Running
```bash
cd frontend
npm run dev
# Should see: "VITE v... ready in ... ms"
```

### 3. Test OAuth Login
1. Open `http://localhost:5173` in browser
2. Click "Continue with Google"
3. Complete Google authentication
4. Should redirect to `/job` page ✅

---

## Diagnostic Test Suite

### Test 1: Cookie Presence Check
**What it tests**: Is the JWT cookie being set on the browser?

**Steps**:
1. Complete OAuth login
2. Open DevTools: **F12**
3. Go to: **Application** tab
4. Click: **Cookies** → **http://localhost:8080**
5. Look for entry named: **`token`**

**Expected Result** ✅:
- Cookie named `token` should exist
- Value should be a JWT (format: `eyJ...`)
- HttpOnly: checked ✓
- SameSite: Lax
- Path: /
- Domain: localhost

**If Missing** ❌:
- Go to [Troubleshooting: No Token Cookie](#troubleshooting)

---

### Test 2: Cookie Transmission Check
**What it tests**: Are cookies being sent with API requests?

**Steps**:
1. After login, go to Applications page
2. Open DevTools: **F12**
3. Go to: **Network** tab
4. Look for request: `my-applications` (or another API call)
5. Click on it
6. Go to: **Headers** section
7. Scroll to: **Request Headers**
8. Look for: **`Cookie`** header

**Expected Result** ✅:
- Cookie header should be present
- Value: `token=eyJ...`

**Example**:
```
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**If Missing** ❌:
- Cookie header not in request headers
- Go to [Troubleshooting: No Cookie in Requests](#troubleshooting)

---

### Test 3: Browser Console Diagnostic
**What it tests**: Automated cookie transmission test

**Steps**:
1. After login, open Browser Console: **F12 → Console**
2. Paste this command:
   ```javascript
   await window.debugCookies.fullDiagnostic()
   ```
3. Press **Enter**
4. Wait for output to complete

**Expected Console Output** ✅:
```
=== 🔍 COOKIE DIAGNOSTIC REPORT ===
Time: 2026-01-04T...

📋 All Cookies (JavaScript visible):
  • (HTTPOnly cookie - not visible)

🔑 Token cookie exists: true

🧪 Testing cookie transmission...
📡 Server received cookies: Cookies received: token=eyJ...;
```

**If Output Shows** ❌:
- "Token cookie exists: false" → Cookie not set
- "No cookies received" → Cookie not being sent

---

### Test 4: API Response Test
**What it tests**: Backend is accepting authenticated requests

**Steps**:
1. After login, go to Applications page
2. Open DevTools: **F12 → Network**
3. Look for any request to: `/api/...` (except `/auth/me`)
4. Click on response request
5. Go to: **Response** tab

**Expected Result** ✅:
- Response status: **200 OK** (or 201 Created, 204 No Content)
- Response body contains data (not error)

**Example Success**:
```json
{
  "success": true,
  "message": "Operations successful",
  "data": [...]
}
```

**If You See 401** ❌:
```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "..."
}
```
- Go to [Troubleshooting: 401 Errors](#troubleshooting)

---

### Test 5: Applications Page Load
**What it tests**: Authenticated page fully functional

**Steps**:
1. After login, click: **Applications** in sidebar
2. Wait for page to load
3. Check for:
   - No loading spinner (should show data)
   - No error message
   - Applications list displayed

**Expected Result** ✅:
- Page loads without errors
- Shows "Submitted Applications" tab
- Lists any submitted applications (or "No applications yet")

**If You See Error** ❌:
- "Failed to load applications" → API call failing
- Check browser console for error details
- Go to [Troubleshooting: API Failures](#troubleshooting)

---

### Test 6: Notifications System
**What it tests**: Notification polling working correctly

**Steps**:
1. After login, look at top right sidebar
2. Should see: Bell icon with notification number (or 0)
3. Open Browser Console: **F12 → Console**
4. Wait 5 seconds
5. Look for logs like:
   ```
   📤 API Request: GET /notifications/unread/count
   📥 API Response: 200 /notifications/unread/count
   ```

**Expected Result** ✅:
- Bell icon appears after ~500ms
- Notification count updates periodically (every 30s)
- No 401 errors in console for notifications

**If Notification Bell Shows Error** ❌:
- "Notifications not available: Request failed with status code 401"
- Go to [Troubleshooting: Notification 401](#troubleshooting)

---

## Automated Test Commands

### Run Full Test Suite
Open browser console and run:
```javascript
// 1. Check cookies
window.debugCookies.getAllCookies()

// 2. Check token exists
window.debugCookies.hasTokenCookie()

// 3. Test transmission
await window.debugCookies.testCookieTransmission()

// 4. Full diagnostic
await window.debugCookies.fullDiagnostic()
```

---

## Troubleshooting

### Problem 1: "No Token Cookie" ❌

**Symptom**: 
- DevTools → Cookies shows no `token` cookie
- `window.debugCookies.hasTokenCookie()` returns `false`

**Possible Causes**:
1. OAuth callback not completing
2. Cookie not being set by backend
3. Browser cookie policy blocking it

**Solutions**:

**A) Check OAuth Callback**:
- Look at browser URL after login
- Should be: `http://localhost:5173/oauth/callback`
- Check browser console for any errors during redirect
- Check backend logs for OAuth processing errors

**B) Verify Backend is Setting Cookie**:
```bash
# Test directly from command line
curl -i http://localhost:8080/api/auth/login/success
# Should see in response: Set-Cookie: token=...
```

**C) Check Browser Cookie Settings**:
- DevTools → Application → Cookies
- Settings → Content Settings → Cookies
- Ensure not "Block all" for this site
- Try using incognito/private window
- Try different browser

---

### Problem 2: "No Cookie in Requests" ❌

**Symptom**:
- Cookie exists in DevTools Cookies tab
- But NOT in request headers for API calls
- `testCookieTransmission()` shows "No cookies received"

**Possible Causes**:
1. `withCredentials: true` not set in Axios
2. CORS `allowCredentials` not enabled on backend
3. Cookie domain/path mismatch

**Solutions**:

**A) Verify Axios Configuration**:
Check `frontend/src/services/api/axiosConfig.js`:
```javascript
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // ✅ MUST be true
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**B) Verify Backend CORS**:
Check `backend/src/main/java/com/harmonix/config/SecurityConfig.java`:
```java
config.setAllowCredentials(true);  // ✅ MUST be true
```

**C) Check Cookie Domain**:
- DevTools → Cookies → click on `token` cookie
- Domain should be: `localhost` or empty (for current domain)
- Path should be: `/`
- If domain shows `.localhost`, it won't work

**D) Test with curl**:
```bash
# If OAuth sets cookie properly, this should work:
curl -i -b "token=YOUR_TOKEN_HERE" http://localhost:8080/api/auth/me
# Should return 200 OK with user data
```

---

### Problem 3: "401 Unauthorized" on API Calls ❌

**Symptom**:
- Cookie exists and is being sent
- But backend returns 401
- Error: "User not found" or "Invalid token"

**Possible Causes**:
1. JWT token is invalid or expired
2. Token can't be decoded by backend
3. User not found in database
4. JWT_SECRET_KEY mismatch

**Solutions**:

**A) Check Backend Logs**:
Look for messages like:
```
[ERROR] JWT validation failed: ...
[ERROR] User not found with email: ...
```

**B) Verify JWT Secret**:
In backend `.env` file:
```
JWT_SECRET_KEY=your-secret-key
JWT_EXPIRATION_MS=3600000
```
- Secret must be at least 32 characters
- Should match between OAuth flow and later API calls

**C) Test Token Directly**:
```bash
# Get a fresh token by logging in via OAuth
# Then use it to test API call
curl -i -H "Cookie: token=YOUR_NEW_TOKEN" http://localhost:8080/api/auth/me
# Should return 200 OK with user data
```

**D) Check Database**:
- Verify user was created in MongoDB during OAuth
- Run: `db.users.find()` in MongoDB
- Should see user with matching email

---

### Problem 4: "Infinite Redirect Loop" ❌

**Symptom**:
- Page keeps refreshing continuously after login
- URL keeps changing between `/` and `/job`
- Browser console shows repeated error messages

**Solutions** (These should already be fixed):
1. ✅ Removed axios auto-redirect on 401
2. ✅ Added useRef redirect guards in Login, OAuthCallback, MainLayout
3. ✅ Added loadingUser dependency check

**If Still Happening**:
- Clear browser cache: **Ctrl+Shift+Delete**
- Hard refresh: **Ctrl+Shift+R**
- Restart frontend dev server: Stop and `npm run dev`
- Check OAuthCallback.jsx for proper redirect guard

---

## Success Checklist

After running tests, verify all ✅:

- ✅ OAuth login completes without errors
- ✅ Redirects to `/job` page (not infinite refresh)
- ✅ DevTools shows `token` cookie in Cookies tab
- ✅ DevTools shows `Cookie` header in API requests
- ✅ `window.debugCookies.hasTokenCookie()` returns `true`
- ✅ `window.debugCookies.testCookieTransmission()` returns cookies to server
- ✅ Applications page loads without 401 error
- ✅ Notification bell appears and updates
- ✅ No 401 errors in browser console
- ✅ Backend logs show no JWT validation errors
- ✅ No error spam (< 5 errors per page load)

---

## Quick Fixes to Try

1. **Hard Refresh Browser**:
   ```
   Ctrl+Shift+R (Windows/Linux)
   Cmd+Shift+R (Mac)
   ```

2. **Clear Cookies**:
   - DevTools → Application → Cookies
   - Right-click → Delete All
   - Refresh and re-login

3. **Restart Backend**:
   ```bash
   # Stop current process (Ctrl+C)
   cd backend && mvnw spring-boot:run
   ```

4. **Restart Frontend**:
   ```bash
   # Stop current process (Ctrl+C)
   cd frontend && npm run dev
   ```

5. **Check Port Availability**:
   ```bash
   # Verify ports are in use
   netstat -an | grep 8080  # Backend
   netstat -an | grep 5173  # Frontend
   ```

---

## When to Contact Support

If all tests pass but you still have issues:
1. Run `window.debugCookies.fullDiagnostic()`
2. Copy full console output
3. Check backend logs for last 50 lines
4. Check browser console for last error
5. Take screenshot of DevTools Network tab
6. Provide these with error report

---

## Test Checklist for CI/CD

To verify in automated tests:
1. ✅ OAuth token is set on login
2. ✅ Cookies are sent with subsequent requests
3. ✅ Backend receives cookies
4. ✅ Authenticated endpoints return 200 OK
5. ✅ Unauthenticated endpoints return 401
6. ✅ No error spam in logs
7. ✅ No infinite redirects
8. ✅ Performance: API calls < 100ms
