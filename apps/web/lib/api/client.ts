import { getSession } from 'next-auth/react';

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code?: string,
    public fieldErrors?: Record<string, string>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    // 2. Get Tenant from localStorage
    const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenant_id') : null;

    const headers = new Headers(init?.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (tenantId) {
      headers.set('x-tenant-id', tenantId);
    }
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || 'An error occurred',
        response.status,
        errorData.code,
        errorData.fieldErrors
      );
    }

    return response.json();
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<T>(`${path}${queryString}`, { method: 'GET' });
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async patch<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
