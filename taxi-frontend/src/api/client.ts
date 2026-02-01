const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const TOKEN_KEY = 'taxi_access_token';

type HttpMethod = 'GET' | 'POST';

type RequestOptions = {
  method: HttpMethod;
  body?: unknown;
};

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export const authToken = {
  get: getToken,
  set(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

export type AuthUser = {
  sub: string;
  email: string;
  role: 'client' | 'driver' | 'admin';
};

export function getAuthUser(): AuthUser | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload as AuthUser;
  } catch {
    return null;
  }
}

async function request<T>(path: string, options: RequestOptions): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get<T>(path: string) {
    return request<T>(path, { method: 'GET' });
  },
  post<T>(path: string, body: unknown) {
    return request<T>(path, { method: 'POST', body });
  },
};
