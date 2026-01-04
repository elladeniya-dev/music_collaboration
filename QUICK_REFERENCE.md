## ⚡ Quick Reference - JWT Cookie Fix

### Problem
✗ User logs in successfully  
✗ User data loads  
✗ **401 errors on subsequent API calls** (Applications, Notifications, etc.)  
✗ Cookie exists but not sent with requests

### Solution Summary
✅ Fixed axios to explicitly send cookies  
✅ Added authentication loading guard  
✅ Fixed backend cookie domain settings  
✅ Added diagnostic tools

---

### Test in 5 Minutes

1. **Restart services:**
   ```bash
   # Terminal 1 - Backend
   cd backend && mvnw spring-boot:run
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. **Test OAuth:**
   - Visit `http://localhost:5173`
   - Click "Continue with Google"
   - Should redirect to `/job` ✅

3. **Check Cookie:**
   - F12 → Application → Cookies → http://localhost:8080
   - Should see `token=eyJ...` ✅

4. **Test API:**
   - Go to Applications page
   - Should load without 401 ✅

5. **Run Diagnostic:**
   - F12 → Console
   - Paste: `await window.debugCookies.fullDiagnostic()`
   - Should show: "Server received cookies: token=..." ✅

---

### Files Changed
| What | File | Fix |
|------|------|-----|
| Axios | `frontend/src/services/api/axiosConfig.js` | Added request logging + explicit withCredentials |
| Auth Guard | `frontend/src/pages/Applications.jsx` | Added loadingUser check |
| Cookie Setup | `backend/src/main/java/com/harmonix/util/CookieUtil.java` | Added explicit domain |
| Debug | `backend/src/main/java/com/harmonix/controller/AuthController.java` | Added /debug/cookies endpoint |
| Debugger | `frontend/src/utils/cookieDebug.js` | NEW - diagnostic utilities |
| Main | `frontend/src/main.jsx` | Exposed debug tools globally |

---

### Troubleshooting

**No Token Cookie?**
- Hard refresh: `Ctrl+Shift+R`
- Clear cookies: DevTools → Cookies → Delete All
- Re-login

**Cookie Not Sent?**
- Check axiosConfig has `withCredentials: true`
- Check backend CorsConfig has `allowCredentials(true)`
- Check cookie domain is `localhost`

**Still Getting 401?**
- Check backend logs for JWT errors
- Run: `await window.debugCookies.fullDiagnostic()`
- Verify JWT_SECRET in backend `.env`

---

### Success Indicators
- ✅ F12 → Cookies shows `token` cookie
- ✅ F12 → Network shows Cookie header in requests
- ✅ Applications page loads (200 OK, not 401)
- ✅ `window.debugCookies.fullDiagnostic()` shows server received cookie
- ✅ No 401 errors in console
- ✅ Notification bell appears and updates

---

### Debug Commands
```javascript
// Check if token cookie exists
window.debugCookies.hasTokenCookie()

// Test if cookies transmitted to backend
await window.debugCookies.testCookieTransmission()

// Full diagnostic (includes both above + server response)
await window.debugCookies.fullDiagnostic()

// List all cookies
window.debugCookies.getAllCookies()
```

---

### Documentation
- **FIX_SUMMARY.md** - Executive summary
- **DEBUGGING_COOKIES.md** - Detailed debugging guide
- **COOKIE_FIX_SUMMARY.md** - Implementation details
- **TESTING_GUIDE.md** - Full test procedures

---

### Key Changes at a Glance

**Frontend - Axios**:
```javascript
// Added to request interceptor
config.withCredentials = true;
console.log(`📤 Request: ${config.method} ${config.url}`);
```

**Frontend - Applications**:
```javascript
// Added guard before fetching
useEffect(() => {
  if (!loadingUser) {  // Wait for auth to complete
    fetchApplications();
  }
}, [activeTab, loadingUser]);
```

**Backend - Cookie**:
```java
// Added domain setting
.domain("localhost")
.path("/")
.sameSite("Lax")
```

---

### Expected Flow ✅
```
1. User clicks "Continue with Google"
   ↓
2. OAuth redirect → Backend creates JWT
   ↓
3. Backend sets HTTP-only cookie (token=...)
   ↓
4. Browser stores cookie in Cookies jar
   ↓
5. Axios sees withCredentials=true
   ↓
6. Axios adds Cookie header to ALL requests
   ↓
7. Backend receives cookie in JwtAuthFilter
   ↓
8. Backend validates JWT
   ↓
9. Request proceeds (200 OK)
```

---

### Command Reference

**Check backend JWT config**:
```bash
# In backend/.env or application.properties
JWT_SECRET_KEY=your-secret
JWT_EXPIRATION_MS=3600000
```

**Test backend cookie reception**:
```bash
curl -i -b "token=YOUR_TOKEN" http://localhost:8080/api/auth/me
# Should return 200 OK (not 401)
```

**Clear backend logs**:
```bash
# Restart backend
cd backend && mvnw spring-boot:run
```

---

**Status**: ✅ Ready for Testing

**Next**: Run the Quick Test (5 min) above and verify all checkpoints pass!
