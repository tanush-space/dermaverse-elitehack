import { useState, useEffect } from 'react';
import { authAPI, tokenManager } from '@/lib/api';

interface User {
  _id: string;
  email: string;
  name: string;
  skinType?: string;
  primaryConcerns?: string[];
  sunExposure?: string;
  pollutionExposure?: string;
  dietPattern?: string;
  rawPhoto?: string;
  onboardingCompleted: boolean;
  createdAt: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const token = tokenManager.getToken();
      
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await authAPI.getCurrentUser();
      setUser(response.user);
      tokenManager.setUser(response.user);
    } catch (err: any) {
      console.error('Failed to fetch user:', err);
      setError(err.response?.data?.message || 'Failed to fetch user data');
      
      // If token is invalid, clear it
      if (err.response?.status === 401) {
        tokenManager.removeToken();
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.removeToken();
      setUser(null);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    tokenManager.setUser(updatedUser);
  };

  useEffect(() => {
    // Check if user is stored in localStorage first
    const storedUser = tokenManager.getUser();
    if (storedUser) {
      setUser(storedUser);
      setLoading(false);
    }

    // Always fetch fresh data if token exists
    const token = tokenManager.getToken();
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    fetchCurrentUser,
    logout,
    updateUser,
    isAuthenticated: !!user && !!tokenManager.getToken(),
  };
};