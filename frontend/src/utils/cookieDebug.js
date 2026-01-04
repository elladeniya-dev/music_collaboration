/**
 * Cookie debugging utilities
 * Use this to diagnose cookie transmission issues
 */

export const debugCookies = {
  // Get all cookies visible to JavaScript
  getAllCookies: () => {
    console.log('📋 All Cookies (JavaScript visible):');
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      console.log('  •', cookie.trim());
    });
    return cookies;
  },

  // Check if JWT token cookie exists
  hasTokenCookie: () => {
    const hasCookie = document.cookie.includes('token=');
    console.log('🔑 Token cookie exists:', hasCookie);
    return hasCookie;
  },

  // Test API call to debug endpoint
  testCookieTransmission: async () => {
    try {
      console.log('🧪 Testing cookie transmission...');
      const response = await fetch('http://localhost:8080/api/auth/debug/cookies', {
        method: 'GET',
        credentials: 'include', // Important: include cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('📡 Server received cookies:', data);
      return data;
    } catch (error) {
      console.error('❌ Error testing cookies:', error);
      return null;
    }
  },

  // Full diagnostic report
  fullDiagnostic: async () => {
    console.log('\n=== 🔍 COOKIE DIAGNOSTIC REPORT ===');
    console.log('Time:', new Date().toISOString());
    console.log('');

    // Check local cookies
    this.getAllCookies();
    console.log('');

    // Check if token exists
    this.hasTokenCookie();
    console.log('');

    // Test transmission
    await this.testCookieTransmission();
    console.log('\n=== END DIAGNOSTIC ===\n');
  },
};

// Call this from browser console to debug
window.debugCookies = debugCookies;

export default debugCookies;
