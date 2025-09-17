import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/Produtos';
import Cupons from './pages/Cupons';
import Pedidos from './pages/Pedidos';
import Clientes from './pages/Clientes';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Rota de login */}
              <Route path="/login" element={<Login />} />
              
              {/* Rotas protegidas */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="produtos" element={<Produtos />} />
                <Route path="cupons" element={<Cupons />} />
                <Route path="pedidos" element={<Pedidos />} />
                <Route path="clientes" element={<Clientes />} />
                <Route path="relatorios" element={<Relatorios />} />
                <Route path="configuracoes" element={<Configuracoes />} />
              </Route>
              
              {/* Rota 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#043E52',
                  border: '1px solid #E16A3D',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                },
                success: {
                  iconTheme: {
                    primary: '#22C55E',
                    secondary: '#fff'
                  }
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff'
                  }
                }
              }}
            />
          </div>
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;