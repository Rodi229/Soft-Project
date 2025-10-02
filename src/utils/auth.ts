// Authentication utilities and session management

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  name: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// Mock user database (in a real app, this would be in your backend)
const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin' as const,
    name: 'ADMIN'
  }
];

// Session storage keys
const AUTH_TOKEN_KEY = 'soft_projects_auth_token';
const USER_DATA_KEY = 'soft_projects_user_data';

// Generate a simple JWT-like token (in production, use proper JWT)
const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  return btoa(JSON.stringify(payload));
};

// Decode token
const decodeToken = (token: string): any => {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
};

// Check if token is valid
const isTokenValid = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return false;
  return Date.now() < decoded.exp;
};

// Login function
export const login = async (username: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = MOCK_USERS.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  const userWithoutPassword = {
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name
  };

  const token = generateToken(userWithoutPassword);

  // Store in localStorage
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userWithoutPassword));

  return { success: true, user: userWithoutPassword, token };
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

// Get current auth state
export const getAuthState = (): AuthState => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userData = localStorage.getItem(USER_DATA_KEY);

  if (!token || !userData || !isTokenValid(token)) {
    // Clean up invalid session
    logout();
    return {
      isAuthenticated: false,
      user: null,
      token: null
    };
  }

  try {
    const user = JSON.parse(userData);
    return {
      isAuthenticated: true,
      user,
      token
    };
  } catch {
    logout();
    return {
      isAuthenticated: false,
      user: null,
      token: null
    };
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getAuthState().isAuthenticated;
};

// Get current user
export const getCurrentUser = (): User | null => {
  return getAuthState().user;
};

// Refresh token (extend session)
export const refreshSession = (): boolean => {
  const authState = getAuthState();
  if (!authState.isAuthenticated || !authState.user) {
    return false;
  }

  // Generate new token
  const newToken = generateToken(authState.user);
  localStorage.setItem(AUTH_TOKEN_KEY, newToken);
  
  return true;
};