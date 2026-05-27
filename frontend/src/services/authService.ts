import { http } from '../api/http';
import { secureStorage } from '../utils/secureStorage';
import type { User } from '../types/user';

interface AuthSession {
  token: string;
  record: User;
}

interface AuthPayload {
  token: string;
  user?: Record<string, unknown>;
  record?: Record<string, unknown>;
}

const normalizePermissions = (raw: unknown): string[] => {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.filter((permission): permission is string => typeof permission === 'string');
};

const normalizeUser = (raw: Record<string, unknown>): User => {
  const id = String(raw.id ?? raw.sub ?? '');
  const email = String(raw.email ?? '');
  const firstName = typeof raw.firstName === 'string' ? raw.firstName : '';
  const lastName = typeof raw.lastName === 'string' ? raw.lastName : '';
  const derivedName = [firstName, lastName].filter(Boolean).join(' ').trim();
  const name = typeof raw.name === 'string' && raw.name.length > 0
    ? raw.name
    : (derivedName || email || 'Usuario');

  const tenantId = String(raw.tenant_id ?? raw.tenantId ?? '');
  const permissions = normalizePermissions(raw.permissions);
  const effectivePermissions = normalizePermissions(
    raw.effective_permissions ?? raw.permissions,
  );

  return {
    id,
    name,
    email,
    role: String(raw.role ?? ''),
    tenant_id: tenantId,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    permissions,
    effective_permissions: effectivePermissions,
  };
};

export const authService = {
  async login(email: string, password: string): Promise<AuthSession> {
    const response = await http.post<AuthPayload>('/auth/login', { email, password });
    const payload = response.data;
    const token = payload.token;
    const rawUser = payload.user ?? payload.record;

    if (!token || !rawUser) {
      throw new Error('Invalid authentication response');
    }

    return {
      token,
      record: normalizeUser(rawUser),
    };
  },

  logout() {
    // Stateless JWT session; local cleanup happens in the auth store.
  },

  async refreshSession(): Promise<AuthSession> {
    const token = secureStorage.get('auth_token');
    if (!token || typeof token !== 'string') {
      throw new Error('No token');
    }

    const response = await http.get<Record<string, unknown>>('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      token,
      record: normalizeUser(response.data),
    };
  },

  getCurrentUser(): User | null {
    const rawUser = secureStorage.get('auth_user');
    if (!rawUser) {
      return null;
    }

    try {
      const parsed = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;
      if (!parsed || typeof parsed !== 'object') {
        return null;
      }

      return normalizeUser(parsed as Record<string, unknown>);
    } catch {
      return null;
    }
  },

  isValid(): boolean {
    return !!secureStorage.get('auth_token');
  },
};
