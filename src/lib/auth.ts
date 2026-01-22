function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Missing auth token");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export default async function authFetch(
  input: RequestInfo,
  init: RequestInit = {}
) {
  const headers = {
    ...getAuthHeaders(),
    ...(init.headers || {}),
  };

  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    // optional: redirect back to Website A
    localStorage.removeItem("authToken");
    window.location.href = import.meta.env.VITE_LOGIN_URL;
  }

  return response;
}
