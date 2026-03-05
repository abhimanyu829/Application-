'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

// Define User type based on backend response
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  avatar?: string;
  picture?: string;
  $id?: string; // For compatibility if referenced elsewhere
  terms_accepted?: boolean;
  privacy_accepted?: boolean;
  policy_version?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderContent({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        // Add token back to user object for easy access
        // Add $id alias for compatibility with existing code that expects Appwrite ID
        setUser({ ...userData, token, $id: userData._id });
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        // The backend expects an ID token or access token.
        // Since useGoogleLogin returns an access_token by default (implicit flow),
        // we send it with a flag so the backend knows to verify it as an access token.
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idToken: tokenResponse.access_token, // Sending access token as idToken
            isAccessToken: true, // Flag to tell backend to treat it as access token
          }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          // Fetch user data immediately to update state
          const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${data.token}` }
          });
          if (userResponse.ok) {
             const userData = await userResponse.json();
             setUser({ ...userData, token: data.token, $id: userData._id });
          }
        } else {
          console.error('Backend login failed', data);
        }
      } catch (error) {
        console.error("Login failed", error);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      console.error('Login Failed');
      setLoading(false);
    },
  });

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Optional: googleLogout();
  };
  
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim());
  const isAdmin = user ? adminEmails.includes(user.email) : false;

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <AuthProviderContent>{children}</AuthProviderContent>
    </GoogleOAuthProvider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
