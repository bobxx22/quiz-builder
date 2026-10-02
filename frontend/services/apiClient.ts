const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch {
    // Network failures and CORS rejections are indistinguishable from the browser.
    throw new ApiError(
      `Cannot reach the API at ${API_URL}. Check that the backend is running and that its CORS_ORIGIN allows this site.`,
      0,
    );
  }

  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const details = Array.isArray(data?.details)
      ? data.details.map((d: { message: string }) => d.message).join(', ')
      : '';
    throw new ApiError(
      [data?.message ?? `Request failed (${response.status})`, details].filter(Boolean).join(': '),
      response.status,
    );
  }

  return data as T;
}
