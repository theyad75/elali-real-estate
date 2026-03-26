const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim();

export const apiBaseUrl =
  configuredBaseUrl && configuredBaseUrl.length > 0
    ? trimTrailingSlash(configuredBaseUrl)
    : "/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const apiRequest = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const isFormData = typeof FormData !== "undefined" && init?.body instanceof FormData;
  const headers = isFormData
    ? { ...(init?.headers ?? {}) }
    : {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      };

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? String(payload.message)
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status);
  }

  return payload as T;
};
