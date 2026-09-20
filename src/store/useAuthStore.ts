import { create } from 'zustand';

export type UserRole = 'student' | 'teacher';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institution?: string;
  xp?: number;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole, name?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (email: string, role: UserRole, name?: string) => {
    const defaultName = name || (role === 'teacher' ? 'Prof. Richard Feynman' : 'Alex Chen');
    const userProfile: UserProfile = {
      id: `usr-${role}-${Date.now()}`,
      name: defaultName,
      email,
      role,
      institution: 'Indian Institute of Quantum Technology (SIH)',
      xp: role === 'student' ? 350 : 1250,
    };

    localStorage.setItem('sih_quantum_user', JSON.stringify(userProfile));
    set({ user: userProfile, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('sih_quantum_user');
    set({ user: null, isAuthenticated: false });
  },
}));
