import type { JSX } from "@emotion/react/jsx-dev-runtime";

export function getAuthHeaders(): HeadersInit | null {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return null;
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
export default async function authFetch(
  input: RequestInfo,
  init: RequestInit = {},
) {
  const headersFromAuth = getAuthHeaders();

  if (!headersFromAuth) {
    localStorage.removeItem("authToken");
    window.location.href = import.meta.env.VITE_LOGIN_URL;
    throw new Error("Not authenticated");
  }

  const response = await fetch(input, {
    ...init,
    headers: {
      ...headersFromAuth,
      ...(init.headers || {}),
    },
  });

  if (response.status === 401) {
    // optional: redirect back to Website A
    localStorage.removeItem("authToken");
    window.location.href = import.meta.env.VITE_VISTA_URL;
    throw new Error("Session expired");
  }

  return response;
}

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    window.location.replace(import.meta.env.VITE_LOGIN_URL);
    return null;
  }

  return children;
}
