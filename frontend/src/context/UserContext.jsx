import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authService } from '../services';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only fetch user once on component mount
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      
      authService.getCurrentUser()
        .then((userData) => {
          console.log('UserContext: User loaded from server:', userData);
          setUser(userData);
          setLoadingUser(false);
        })
        .catch((error) => {
          // Silently handle 401 Unauthorized - this is normal on first load
          if (error.response?.status === 401) {
            console.log('UserContext: User not authenticated');
          } else {
            console.warn('UserContext: Error loading user:', error?.message);
          }
          setUser(null);
          setLoadingUser(false);
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext); // ✅ this line must be here
