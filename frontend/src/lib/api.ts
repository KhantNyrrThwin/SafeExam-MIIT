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

