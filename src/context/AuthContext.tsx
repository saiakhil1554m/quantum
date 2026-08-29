import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/auth/AuthService';
import { DEMO_CREDENTIALS } from '../services/auth/DemoAuthProvider';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  authError: string | null;
  login: (employeeId: string, password: string, selectedRole?: UserRole) => Promise<User>;
  loginAsDemoRole: (role: UserRole) => Promise<User>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  clearError: () => void;
  getDefaultRouteForRole: (role: UserRole) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const getDefaultRouteForRole = (role: UserRole): string => {
  switch (role) {
    case 'employee':
      return '/employee';
    case 'it_support':
    case 'it_staff':
      return '/it';
    case 'manager':
      return '/manager';
    case 'admin':
      return '/admin';
    default:
      return '/employee';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (isMounted) {
          setCurrentUser(user);
        }
      } catch (err) {
        console.error('Session initialization error:', err);
        if (isMounted) {
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (employeeId: string, password: string, selectedRole?: UserRole): Promise<User> => {
    setLoading(true);
    setAuthError(null);

    // Validation checks
    if (!employeeId || !employeeId.trim()) {
      setLoading(false);
      const errorMsg = 'Please enter your Employee ID.';
      setAuthError(errorMsg);
      throw new Error(errorMsg);
    }

    if (!password) {
      setLoading(false);
      const errorMsg = 'Please enter your password.';
      setAuthError(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      const user = await authService.login(employeeId, password);

      // Validate selected role against account permissions
      if (selectedRole) {
        const userNorm = user.role === 'it_staff' ? 'it_support' : user.role;
        const targetNorm = selectedRole === 'it_staff' ? 'it_support' : selectedRole;

        if (targetNorm === 'it_support' && userNorm === 'employee') {
          const deniedMsg = `Access Denied: Account ${employeeId} does not have IT Support authorization.`;
          setAuthError(deniedMsg);
          throw new Error(deniedMsg);
        }
      }

      setCurrentUser(user);
      setAuthError(null);
      return user;
    } catch (err: any) {
      const msg = err?.message || 'Invalid Employee ID or password.';
      setAuthError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginAsDemoRole = useCallback(async (role: UserRole): Promise<User> => {
    const normalizedRole = role === 'it_staff' ? 'it_support' : role;
    const cred = DEMO_CREDENTIALS.find(c => {
      const cRole = c.user.role === 'it_staff' ? 'it_support' : c.user.role;
      return cRole === normalizedRole;
    }) || DEMO_CREDENTIALS[0];

    return login(cred.employeeId, cred.passwordHash);
  }, [login]);

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
      setCurrentUser(null);
      setAuthError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const hasRole = useCallback((roleOrRoles: UserRole | UserRole[]): boolean => {
    if (!currentUser) return false;
    const currentNormalized = currentUser.role === 'it_staff' ? 'it_support' : currentUser.role;
    
    if (Array.isArray(roleOrRoles)) {
      return roleOrRoles.some(r => {
        const normalized = r === 'it_staff' ? 'it_support' : r;
        return normalized === currentNormalized;
      });
    }

    const targetNormalized = roleOrRoles === 'it_staff' ? 'it_support' : roleOrRoles;
    return currentNormalized === targetNormalized;
  }, [currentUser]);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        loading,
        authError,
        login,
        loginAsDemoRole,
        logout,
        hasRole,
        clearError,
        getDefaultRouteForRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
