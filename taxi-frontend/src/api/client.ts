const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

type HttpMethod = 'GET' | 'POST';

type RequestOptions = {
  method: HttpMethod;
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
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
