import { AuthProvider, User, AuthSession } from '../../types';

export interface DemoCredential {
  employeeId: string;
  passwordHash: string; // Stored in memory for demo validation
  user: User;
}

export const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    employeeId: 'EMP001',
    passwordHash: 'Employee@123',
    user: {
      id: 'usr_emp_001',
      employeeId: 'EMP001',
      name: 'Rahul Kumar',
      role: 'employee',
      department: 'Finance',
      designation: 'Senior Financial Analyst',
      email: 'rahul.kumar@powergrid.in',
      phone: '+91 98101 23456',
      location: 'Corporate HQ, Gurugram',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  },
  {
    employeeId: 'IT001',
    passwordHash: 'ITSupport@123',
    user: {
      id: 'usr_it_001',
      employeeId: 'IT001',
      name: 'Ananya Sharma',
      role: 'it_support',
      team: 'Network Support',
      department: 'IT Infrastructure & Operations',
      designation: 'Lead Incident Engineer (L2/L3)',
      email: 'ananya.sharma@powergrid.in',
      phone: '+91 98765 43210',
      location: 'Corporate NOC, Gurugram',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
  },
  {
    employeeId: 'MGR001',
    passwordHash: 'Manager@123',
    user: {
      id: 'usr_mgr_001',
      employeeId: 'MGR001',
      name: 'Vikram Rao',
      role: 'manager',
      department: 'IT Operations & Service Delivery',
      designation: 'Director of Enterprise IT Services',
      email: 'vikram.rao@powergrid.in',
      phone: '+91 98202 34567',
      location: 'Corporate Centre, Delhi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  },
  {
    employeeId: 'ADM001',
    passwordHash: 'Admin@123',
    user: {
      id: 'usr_adm_001',
      employeeId: 'ADM001',
      name: 'System Administrator',
      role: 'admin',
      department: 'Enterprise Security & Governance',
      designation: 'Chief Information Security Officer (CISO)',
      email: 'admin.gridmind@powergrid.in',
      phone: '+91 98000 00001',
      location: 'Global Data Center, Bengaluru',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    },
  },
];

const STORAGE_SESSION_KEY = 'gridmind_auth_session';

export class DemoAuthProvider implements AuthProvider {
  /**
   * Validates employee credentials against the secure demo user store
   */
  async login(employeeId: string, password: string): Promise<User> {
    // Artificial slight network latency for realistic authentic enterprise feel
    await new Promise(resolve => setTimeout(resolve, 450));

    const normalizedId = employeeId.trim().toUpperCase();
    const matched = DEMO_CREDENTIALS.find(
      cred => cred.employeeId.toUpperCase() === normalizedId
    );

    // Validate credentials securely without leaking account existence
    if (!matched || matched.passwordHash !== password) {
      throw new Error('Invalid employee ID or password.');
    }

    const session: AuthSession = {
      user: matched.user,
      token: `grm_${Math.random().toString(36).substring(2)}_${Date.now()}`,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hour session
    };

    // Store in both session/local storage for persistence across reloads
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
      sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    } catch {
      // Storage access gracefully handled
    }

    return matched.user;
  }

  /**
   * Destroys the active session and clears all tokens
   */
  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 150));
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
      sessionStorage.removeItem(STORAGE_SESSION_KEY);
    } catch {
      // Storage access handled
    }
  }

  /**
   * Retrieves the current authenticated user if the session is valid
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const raw =
        sessionStorage.getItem(STORAGE_SESSION_KEY) ||
        localStorage.getItem(STORAGE_SESSION_KEY);
      if (!raw) return null;

      const session: AuthSession = JSON.parse(raw);
      if (session && session.expiresAt > Date.now() && session.user) {
        return session.user;
      }

      // Expired session
      this.logout();
      return null;
    } catch {
      return null;
    }
  }
}
