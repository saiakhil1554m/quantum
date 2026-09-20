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

  login: (email?: string, role: UserRole = 'student', name?: string) => {
    const defaultName = name || 'Jaswanth';
    const defaultEmail = email || 'jaswanth@quantumlearn.ai';

    const userProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      name: defaultName,
      email: defaultEmail,
      role: 'student',
      institution: 'QuantumLearn Mobile Academy',
      xp: 450,
    };

    localStorage.setItem('sih_quantum_user', JSON.stringify(userProfile));
    set({ user: userProfile, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('sih_quantum_user');
    set({ user: null, isAuthenticated: false });
  },
}));
