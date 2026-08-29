import { AuthProvider, User } from '../../types';
import { DemoAuthProvider, DEMO_CREDENTIALS } from './DemoAuthProvider';

class AuthService implements AuthProvider {
  private provider: AuthProvider;

  constructor(provider?: AuthProvider) {
    this.provider = provider || new DemoAuthProvider();
  }

  /**
   * Allows hot-swapping provider to Supabase or other identity providers in the future
   */
  setProvider(provider: AuthProvider) {
    this.provider = provider;
  }

  async login(employeeId: string, password: string): Promise<User> {
    return this.provider.login(employeeId, password);
  }

  async logout(): Promise<void> {
    return this.provider.logout();
  }

  async getCurrentUser(): Promise<User | null> {
    return this.provider.getCurrentUser();
  }

  /**
   * Helper to inspect demo accounts list for login hints / demo shortcuts
   */
  getDemoCredentials() {
    return DEMO_CREDENTIALS.map(c => ({
      employeeId: c.employeeId,
      password: c.passwordHash,
      name: c.user.name,
      role: c.user.role,
      department: c.user.department,
      team: c.user.team,
    }));
  }
}

export const authService = new AuthService();
