export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

const TOKEN_KEY = 'mindwell_token';
const USER_KEY = 'mindwell_user';

export const saveAuth = (token: string, user: AuthUser) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const getUser = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = (): boolean => !!getToken();
