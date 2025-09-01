// Use EXPO_PUBLIC_API_URL if provided, otherwise default to localhost
// On Android emulator, you may need to use http://10.0.2.2:3001
export const API_BASE_URL =
  (process.env.EXPO_PUBLIC_API_URL?.trim() as string) || 'http://localhost:3001';

let authToken: string | undefined;

export function setAuthToken(token?: string) {
  authToken = token || undefined;
}

async function apiRequest<T = any>(method: 'GET' | 'POST' | 'PATCH' | 'DELETE', path: string, body?: any): Promise<T> {
  const res = await fetch(`${API_BASE_URL}/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = text;
  }

  if (!res.ok) {
    const errorMessage = (data && (data.error || data.message)) || res.statusText;
    const error: any = new Error(errorMessage);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data as T;
}

export function apiGet<T = any>(path: string) {
  return apiRequest<T>('GET', path);
}

export function apiPost<T = any>(path: string, body?: any) {
  return apiRequest<T>('POST', path, body);
}


