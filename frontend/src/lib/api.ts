const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost/safeexam/backend/public/api';

export async function apiJson<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }
  return res.json();
}

export async function apiUpload<T>(path: string, form: FormData): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    body: form,
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }
  return res.json();
}

export type AuthUser = { user_id: number; username: string; role: 'teacher' | 'admin' };

export async function apiMe(): Promise<AuthUser | null> {
  const data = await apiJson<{ user: AuthUser | null }>(`/auth/me.php`, { method: 'GET' });
  return data.user;
}

export async function apiLogin(username: string, password: string): Promise<AuthUser> {
  const data = await apiJson<{ user: AuthUser }>(`/auth/login.php`, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  return data.user;
}

export async function apiLogout(): Promise<void> {
  await apiJson(`/auth/logout.php`, { method: 'POST' });
}

