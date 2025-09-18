import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types
export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  phone?: string;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    
    default:
      return state;
  }
}

// Context
const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
} | null>(null);

// Types for registration
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone?: string;
}

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('dahora-roots-token');
      if (token) {
        try {
          dispatch({ type: 'AUTH_START' });
          
          const response = await fetch('http://localhost:5000/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const result = await response.json();
            const user = result.user;
            
            // Usar dados do novo backend
            const frontendUser = {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              phone: user.telefone,
              createdAt: user.created_at
            };
            
            dispatch({ type: 'AUTH_SUCCESS', payload: frontendUser });
          } else {
            localStorage.removeItem('dahora-roots-token');
            dispatch({ type: 'AUTH_FAILURE', payload: 'Sessão expirada' });
          }
        } catch (error) {
          localStorage.removeItem('dahora-roots-token');
          dispatch({ type: 'AUTH_FAILURE', payload: 'Erro ao verificar autenticação' });
        }
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (response.ok) {
        const result = await response.json();
        const { user, token } = result;
        localStorage.setItem('dahora-roots-token', token);
        
        // Usar dados do novo backend
        const frontendUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
        
        dispatch({ type: 'AUTH_SUCCESS', payload: frontendUser });
      } else {
        const error = await response.json();
        dispatch({ type: 'AUTH_FAILURE', payload: error.message || 'Erro ao fazer login' });
      }
    } catch (error) {
      console.error('Erro no login:', error);
      dispatch({ type: 'AUTH_FAILURE', payload: 'Erro de conexão. Verifique se o servidor está rodando.' });
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Usar dados do novo backend
      const backendData = {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || null,
      };
      
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });
      
      if (response.ok) {
        const result = await response.json();
        const { user, token } = result;
        localStorage.setItem('dahora-roots-token', token);
        
        // Usar dados do novo backend
        const frontendUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
        
        dispatch({ type: 'AUTH_SUCCESS', payload: frontendUser });
      } else {
        const error = await response.json();
        dispatch({ type: 'AUTH_FAILURE', payload: error.message || 'Erro ao criar conta' });
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      dispatch({ type: 'AUTH_FAILURE', payload: 'Erro de conexão. Verifique se o servidor está rodando.' });
    }
  };

  const logout = () => {
    localStorage.removeItem('dahora-roots-token');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}