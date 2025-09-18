import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login',
  requiredRole
}) => {
  const { state } = useAuth();
  const location = useLocation();

  // Se não estiver autenticado, redireciona para login
  if (!state.isAuthenticated) {
    // Salva a URL atual para redirecionar após login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Se requer role específica e usuário não tem, redireciona
  if (requiredRole && state.user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Se estiver autenticado e tiver a role necessária, renderiza o componente
  return <>{children}</>;
};

export default ProtectedRoute;