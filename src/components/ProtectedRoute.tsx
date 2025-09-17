import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const { state } = useAuth();
  const location = useLocation();

  // Se não estiver autenticado, redireciona para login
  if (!state.isAuthenticated) {
    // Salva a URL atual para redirecionar após login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Se estiver autenticado, renderiza o componente
  return <>{children}</>;
};

export default ProtectedRoute;