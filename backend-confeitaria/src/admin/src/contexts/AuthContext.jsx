import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));

  // Verifica se o usuário está autenticado ao carregar a aplicação
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.success) {
            setUser(response.data.data.user);
          } else {
            // Token inválido
            logout();
          }
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { user: userData, token: newToken } = response.data.data;
        
        // Verifica se é administrador
        if (!['super_admin', 'admin', 'moderator'].includes(userData.tipo_usuario)) {
          throw new Error('Acesso negado. Apenas administradores podem acessar este painel.');
        }
        
        setUser(userData);
        setToken(newToken);
        localStorage.setItem('admin_token', newToken);
        
        toast.success(`Bem-vindo, ${userData.nome_completo}!`);
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Erro ao fazer login');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Erro ao fazer login';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('admin_token');
    toast.success('Logout realizado com sucesso!');
  };

  const updateProfile = async (data) => {
    try {
      const response = await api.put('/auth/profile', data);
      
      if (response.data.success) {
        setUser(response.data.data.user);
        toast.success('Perfil atualizado com sucesso!');
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Erro ao atualizar perfil';
      toast.error(message);
      return { success: false, message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/auth/change-password', {
        senha_atual: currentPassword,
        nova_senha: newPassword
      });
      
      if (response.data.success) {
        toast.success('Senha alterada com sucesso!');
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Erro ao alterar senha');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Erro ao alterar senha';
      toast.error(message);
      return { success: false, message };
    }
  };

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  const isSuperAdmin = () => {
    return user?.tipo_usuario === 'super_admin';
  };

  const isAdmin = () => {
    return ['super_admin', 'admin'].includes(user?.tipo_usuario);
  };

  const canEdit = () => {
    return ['super_admin', 'admin'].includes(user?.tipo_usuario);
  };

  const canDelete = () => {
    return user?.tipo_usuario === 'super_admin';
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated,
    isSuperAdmin,
    isAdmin,
    canEdit,
    canDelete
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};