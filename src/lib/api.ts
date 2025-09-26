// Minimal fetch wrapper with token storage & 401 handling

const BASE = import.meta.env.VITE_API_URL as string;
console.log("[VITE_API_URL]", BASE); 
const LS_KEY = "tm_jwt";

let authToken: string | null = localStorage.getItem(LS_KEY);

export function setToken(t: string) {
  authToken = t;
  localStorage.setItem(LS_KEY, t);
}
export function clearToken() {
  authToken = null;
  localStorage.removeItem(LS_KEY);
}
export function getToken() {
  return authToken;
}

type Options = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

export async function api(path: string, opts: Options = {}) {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const res = await fetch(`${BASE}${path}`, {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  // Normalize JSON errors
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  

  if (!BASE) {
  console.warn(
    "[VITE] VITE_API_URL is missing. Check .env.development at the project root."
  );
  } 
  
  if (!res.ok) {
    if (res.status === 401) {
      clearToken();
    }
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}
