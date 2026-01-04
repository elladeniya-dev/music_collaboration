# 🔐 JWT Cookie Authentication Flow Diagram

## Before Fix (Broken) ❌

```
┌─────────────────────────────────────────────────────────────────┐
│                          BROWSER                               │
└─────────────────────────────────────────────────────────────────┘

1. User clicks "Continue with Google"
   ↓
2. OAuth redirect → localhost:8080/oauth/callback
   ↓
3. Backend creates JWT token
   ↓
4. Backend sends: Set-Cookie: token=eyJ... ✅
   ↓
5. Cookie stored in browser cookie jar ✅
   ↓
6. Redirect to /oauth/callback → /job ✅
   ↓
7. UserContext calls /api/auth/me
   ↓
8. Axios sends Cookie header ✅
   ↓
9. Backend validates JWT ✅
   ↓
10. User data loads ✅
    └─→ Successfully shows user info

BUT THEN:

11. Applications page tries to fetch /api/applications/my-applications
    ↓
12. Axios.create({withCredentials: true}) ← ONLY in default create, not in requests!
    ↓
13. Actual request sent WITHOUT Cookie header ❌
    ↓
14. Backend receives request with NO cookie
    ↓
15. JwtAuthFilter tries to find cookie
    ↓
16. Cookie is null ❌
    ↓
17. Backend returns 401 Unauthorized ❌
    ↓
18. Browser shows error: "Error fetching applications"
```

## After Fix (Working) ✅

```
┌─────────────────────────────────────────────────────────────────┐
│                          BROWSER                               │
└─────────────────────────────────────────────────────────────────┘

OAUTH LOGIN:
1. User clicks "Continue with Google"
   ↓
2. OAuth redirect → localhost:8080/oauth/callback
   ↓
3. Backend creates JWT token
   ↓
4. Backend sends: Set-Cookie: token=eyJ...
   │  Headers: domain=localhost, path=/, samesite=Lax, httpOnly=true
   ↓
5. Cookie stored in browser cookie jar ✅
   ↓
6. Redirect to /oauth/callback → /job ✅
   ↓

INITIAL API CALL (from UserContext):
7. UserContext calls /api/auth/me
   ↓
8. axiosConfig.js request interceptor:
   │  - Ensures: config.withCredentials = true ✅
   │  - Adds Cookie header if present
   ↓
9. Browser includes: Cookie: token=eyJ... ✅
   ↓
10. Backend receives request with cookie
    ↓
11. JwtAuthFilter extracts cookie
    ↓
12. JwtUtil validates JWT ✅
    ↓
13. User found in database ✅
    ↓
14. Backend returns 200 OK with user data ✅
    ↓
15. UserContext sets user state ✅

AUTHENTICATED API CALLS:
16. Applications page waits for loadingUser to finish ✅
    ↓
17. Applications page calls /api/applications/my-applications
    ↓
18. axiosConfig request interceptor runs AGAIN:
    │  - Ensures: config.withCredentials = true ✅
    │  - Includes Cookie header
    ↓
19. Browser sends: Cookie: token=eyJ... ✅
    ↓
20. Backend receives request with cookie ✅
    ↓
21. JwtAuthFilter validates JWT ✅
    ↓
22. Backend returns 200 OK with applications data ✅
    ↓
23. Applications page displays data ✅

NOTIFICATIONS:
24. NotificationBell component mounts
    ↓
25. Waits 500ms (to let auth complete)
    ↓
26. Calls /api/notifications/unread/count
    ↓
27. axiosConfig interceptor:
    │  - Ensures credentials: true ✅
    │  - Includes Cookie header ✅
    ↓
28. Backend responds with notification count ✅
    ↓
29. Polls every 30 seconds with same flow ✅
```

## Key Difference: Axios Configuration

### Before (Broken) ❌
```javascript
// axiosConfig.js
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // Set on instance
  headers: { 'Content-Type': 'application/json' },
});

// But each request still didn't guarantee credentials
```

### After (Fixed) ✅
```javascript
// axiosConfig.js
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// REQUEST INTERCEPTOR - CRITICAL FIX
axiosInstance.interceptors.request.use((config) => {
  // Explicitly set for EVERY request
  config.withCredentials = true; // ✅ NOW included in all requests
  console.log(`📤 API Request: ${config.method} ${config.url}`);
  return config;
});
```

## Cookie Lifecycle

```
STEP 1: OAuth Callback
┌────────────────────────────────────────┐
│ Backend: AuthController.loginSuccess() │
│                                        │
│ String jwt = JwtUtil.generateToken();  │
│ String cookie =                        │
│   CookieUtil.createTokenCookie(jwt);   │
│                                        │
│ response.addHeader(                    │
│   "Set-Cookie",                        │
│   "token=eyJ...; Domain=localhost;     │
│    Path=/; SameSite=Lax; HttpOnly"     │
│ );                                     │
└────────────────────────────────────────┘
        ↓ HTTP Response Header
┌────────────────────────────────────────┐
│ Browser: Receives Set-Cookie Header    │
│                                        │
│ Stores: {                              │
│   name: "token",                       │
│   value: "eyJ...",                     │
│   domain: "localhost",                 │
│   path: "/",                           │
│   httpOnly: true,                      │
│   sameSite: "Lax",                     │
│   maxAge: 3600                         │
│ }                                      │
└────────────────────────────────────────┘

STEP 2: API Request with Cookie
┌────────────────────────────────────────┐
│ Browser: Making API Request            │
│                                        │
│ GET /api/applications/my-applications  │
│ Host: localhost:8080                   │
│ Content-Type: application/json         │
│ Cookie: token=eyJ...  ✅ INCLUDED      │
└────────────────────────────────────────┘
        ↓ HTTP Request
┌────────────────────────────────────────┐
│ Backend: JwtAuthFilter.doFilterInternal() │
│                                        │
│ if (request.getCookies() != null) {    │
│   for (Cookie c : request.getCookies()) {
│     if ("token".equals(c.getName())) { │
│       String email =                   │
│         JwtUtil.validate(c.getValue()) │
│       ✅ User authenticated!           │
│     }                                  │
│   }                                    │
│ }                                      │
└────────────────────────────────────────┘
        ↓ Allow Request to Proceed
┌────────────────────────────────────────┐
│ Response: 200 OK with Data             │
│ {                                      │
│   "success": true,                     │
│   "data": [applications...]            │
│ }                                      │
└────────────────────────────────────────┘
```

## Authentication State Machine

```
START
  │
  ├─ loadingUser = true
  │
  └─→ UserContext: getCurrentUser()
       │
       ├─ Makes request to /api/auth/me
       │  └─ Axios INCLUDES cookie ✅
       │
       ├─ Backend validates JWT from cookie
       │
       ├─ User found ✅
       │
       └─→ setUser(userData)
            setLoadingUser(false)
            │
            ├─→ Applications component:
            │    "if (!loadingUser)" → Now TRUE
            │    → Calls fetchApplications()
            │       └─ Makes request to /api/applications
            │          └─ Axios INCLUDES cookie ✅
            │             └─ Backend validates
            │                └─ Returns applications ✅
            │
            └─→ NotificationBell component:
                 setTimeout(500ms)
                 → Calls getUnreadCount()
                    └─ Makes request to /api/notifications/unread/count
                       └─ Axios INCLUDES cookie ✅
                          └─ Backend validates
                             └─ Returns count ✅
```

## How withCredentials: true Works

```
WITHOUT withCredentials:
┌─────────────────────────────────┐
│ Browser Cookie Storage          │
│ ┌─────────────────────────────┐ │
│ │ token: eyJ...               │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
           ↓ (ignored)
┌─────────────────────────────────┐
│ API Request to localhost:8080   │
│ Headers {                       │
│   Cookie: (EMPTY) ❌           │
│ }                               │
└─────────────────────────────────┘


WITH withCredentials: true:
┌─────────────────────────────────┐
│ Browser Cookie Storage          │
│ ┌─────────────────────────────┐ │
│ │ token: eyJ...               │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
           ↓ (included)
┌─────────────────────────────────┐
│ API Request to localhost:8080   │
│ Headers {                       │
│   Cookie: token=eyJ... ✅      │
│ }                               │
└─────────────────────────────────┘
```

## Fixes Applied

```
┌─────────────────────────────────────────────┐
│ PROBLEM                                     │
├─────────────────────────────────────────────┤
│ Cookie created ✅                           │
│ Cookie sent on /api/auth/me ✅             │
│ BUT NOT sent on other endpoints ❌         │
│ (axiosConfig set withCredentials on        │
│  instance, but not enforced on requests)   │
└─────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────┐
│ FIX 1: Axios Request Interceptor            │
├─────────────────────────────────────────────┤
│ EVERY request now does:                     │
│ config.withCredentials = true               │
│ → Ensures credentials ALWAYS sent ✅       │
└─────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────┐
│ FIX 2: Applications Loading Guard           │
├─────────────────────────────────────────────┤
│ Don't fetch until:                          │
│ loadingUser === false ✅                   │
│ → Ensures UserContext auth complete        │
└─────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────┐
│ FIX 3: Backend Cookie Domain                │
├─────────────────────────────────────────────┤
│ Added explicit:                             │
│ .domain("localhost")                        │
│ .path("/")                                  │
│ → Ensures cookie properly scoped ✅        │
└─────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────┐
│ RESULT: Cookie transmitted with ALL requests
│ ✅ /api/auth/me works                       │
│ ✅ /api/applications/my-applications works │
│ ✅ /api/notifications works                 │
│ ✅ All authenticated endpoints accessible   │
└─────────────────────────────────────────────┘
```

## Testing Flow

```
TEST 1: Cookie Exists?
Browser: F12 → Cookies → http://localhost:8080
Should see: token=eyJ...
Result: ✅ or ❌

TEST 2: Cookie Sent?
Browser: F12 → Network → Click API request → Headers
Look for: Cookie: token=eyJ...
Result: ✅ or ❌

TEST 3: Server Received?
Browser Console: await window.debugCookies.testCookieTransmission()
Should show: Cookies received: token=eyJ...;
Result: ✅ or ❌

TEST 4: API Working?
Browser: Go to /applications page
Should see data (not 401 error)
Result: ✅ or ❌
```
