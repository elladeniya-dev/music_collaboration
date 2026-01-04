import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { authService } from '../services';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Start processing immediately, don't wait for UserContext
    if (!isProcessing) {
      setIsProcessing(true);
      
      const fetchUser = async () => {
        try {
          console.log('OAuthCallback: Fetching user data...');
          const userData = await authService.getCurrentUser();
          console.log('OAuthCallback: User data received:', userData);
          setUser(userData);
          // Use a small delay to ensure state updates before navigation
          setTimeout(() => {
            navigate('/job', { replace: true });
          }, 100);
        } catch (error) {
          console.error('OAuthCallback: Failed to fetch user:', error);
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 100);
        }
      };

      fetchUser();
    }
  }, [isProcessing, setUser, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing login...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
