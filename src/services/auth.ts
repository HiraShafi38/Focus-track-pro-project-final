import { api, setToken, clearToken, getToken } from "../lib/api";

export type User = { id?: string; _id?: string; email: string; name?: string; createdAt?: string };

export async function register(email: string, password: string, name?: string) {
  const res = await api("/api/auth/register", { method: "POST", body: { email, password, name } });
  setToken(res.token);
  return res.user as User;
}

export async function login(email: string, password: string) {
  const res = await api("/api/auth/login", { method: "POST", body: { email, password } });
  setToken(res.token);
  return res.user as User;
}

export async function me(): Promise<User | null> {
  if (!getToken()) return null;
  try {
    const res = await api("/api/auth/me");
    return res.user as User;
  } catch {
    clearToken();
    return null;
  }
}

export function logout() {
  clearToken();
}
