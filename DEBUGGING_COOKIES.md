# JWT Cookie Debugging Guide

## Problem Summary
User successfully authenticates via OAuth, but subsequent API calls (Applications, Notifications, etc.) fail with **401 Unauthorized**. This indicates the JWT cookie is not being transmitted with requests after the initial OAuth callback.

## Root Causes to Check

### 1. **Cookie Not Being Set on OAuth Callback**
- The OAuth callback may not be properly setting the HTTP-only cookie
- Or the cookie settings (SameSite, Secure, Domain) are incorrect

### 2. **Cookie Not Being Sent with Requests**
- Even if the cookie is set, Axios might not be sending it due to CORS issues
- Or the cookie path/domain settings prevent it from being sent

### 3. **Backend Not Receiving the Cookie**
- The JwtAuthFilter might not be extracting the cookie properly
- Or the cookie validation is failing silently

## How to Debug

### Step 1: Check Browser DevTools (F12)
1. Open Browser DevTools → **Application** tab
2. Go to **Cookies** → **http://localhost:8080**
3. Look for a cookie named **`token`**
4. Verify it has these properties:
   - ✅ Name: `token`
   - ✅ Value: (JWT token, looks like `eyJ...`)
   - ✅ HttpOnly: `✓` (checked)
   - ✅ Secure: `✗` (unchecked for localhost, would be checked for HTTPS)
   - ✅ SameSite: `Lax`
   - ✅ Domain: `localhost` (or empty for current domain)
   - ✅ Path: `/`

### Step 2: Check Network Requests
1. Open DevTools → **Network** tab
2. Go to **Applications** page or any authenticated page
3. Look at the request to `/api/applications/my-applications`
4. In the **Headers** section, check **Request Headers**:
   - Look for **`Cookie`** header
   - It should contain: `token=eyJ...`
5. If the Cookie header is missing, the problem is confirmed

### Step 3: Run Browser Console Diagnostic
1. Open Browser Console (F12 → Console tab)
2. Paste and run:
   ```javascript
   window.debugCookies.fullDiagnostic()
   ```
3. This will:
   - Show all cookies
   - Check if token cookie exists
   - Make a test request to `/api/auth/debug/cookies`
   - Show what cookies the server received

### Step 4: Check Backend Logs
Look for debug output from the `/api/auth/debug/cookies` endpoint:
```
🔍 DEBUG: Cookies received: token=eyJ...; ...
```

If it says "No cookies received", the cookie is not being transmitted.

## Common Solutions

### If Cookie Not Set on OAuth Callback:

**Frontend OAuthCallback.jsx:**
- Verify the redirect happens immediately after login
- Check that the browser stores the Set-Cookie header from the response

**Backend CookieUtil.java:**
- Verify cookie settings:
  ```java
  .httpOnly(true)     // ✅ Must be true (prevents JavaScript access)
  .secure(false)      // ✅ false for localhost, true for HTTPS
  .path("/")          // ✅ Must be "/"
  .sameSite("Lax")    // ✅ Must be "Lax" for cross-origin
  .domain("localhost") // ✅ Added for explicit domain
  ```

### If Cookie Not Being Sent with Requests:

**Frontend axiosConfig.js:**
- Verify `withCredentials: true` is set:
  ```javascript
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,  // ✅ CRITICAL for sending cookies
    headers: {
      'Content-Type': 'application/json',
    },
  });
  ```

**Backend CorsConfig.java:**
- Verify `allowCredentials(true)` and origin patterns:
  ```java
  .allowCredentials(true)
  .allowedOriginPatterns(allowedOrigins.split(","))
  ```

### If Backend Not Receiving Cookie:

**Backend JwtAuthFilter.java:**
- Verify filter is checking cookies:
  ```java
  if (request.getCookies() != null) {
    for (Cookie cookie : request.getCookies()) {
      if (AppConstants.TOKEN_COOKIE_NAME.equals(cookie.getName())) {
        // Extract and validate JWT
      }
    }
  }
  ```

## Testing Steps

### 1. After OAuth Login:
```
✅ User should be on /job page
✅ Console should show: "UserContext: User loaded from server: {...}"
✅ DevTools Cookies should show "token" cookie
```

### 2. Navigate to Applications Page:
```
✅ Applications should load without error
✅ DevTools Network should show:
   - Request: GET /api/applications/my-applications
   - Headers: Contains "Cookie: token=..."
   - Response: 200 OK with data
```

### 3. Run Diagnostic:
```javascript
window.debugCookies.fullDiagnostic()
```
Should show:
- Token cookie exists in JavaScript (or "HTTPOnly - not visible")
- Server received the token cookie

## If Problem Persists:

1. **Check backend console for errors:**
   ```
   Look for "No user found" or JWT validation errors
   ```

2. **Verify backend is running:**
   ```bash
   curl -i http://localhost:8080/api/auth/me
   # Should return 401 without cookie, 200 with valid cookie
   ```

3. **Test cookie transmission directly:**
   ```bash
   # Include cookies in request
   curl -i -b "token=YOUR_TOKEN_HERE" http://localhost:8080/api/applications/my-applications
   ```

## Quick Fixes to Try

1. **Clear browser cookies and re-login:**
   - DevTools → Application → Cookies → Delete all
   - Refresh page and re-authenticate

2. **Hard refresh browser:**
   - Ctrl+Shift+R (or Cmd+Shift+R on Mac)
   - Clears cache and reloads everything

3. **Restart backend:**
   - Stop the Spring Boot app
   - Run: `mvnw spring-boot:run`
   - Try authentication again

4. **Check if backend is actually setting cookie:**
   - Navigate to: `http://localhost:8080/api/auth/debug/cookies`
   - Should return what cookies the server sees
   - If empty, backend is receiving no cookies

## Success Indicators

When everything is working:
1. ✅ OAuth login completes smoothly
2. ✅ User redirects to /job page (NOT infinite refresh)
3. ✅ DevTools shows "token" cookie with JWT value
4. ✅ Network requests include Cookie header
5. ✅ Applications page loads without 401 error
6. ✅ All API endpoints return 200 OK
7. ✅ No error spam in browser console
