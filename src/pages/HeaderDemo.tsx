import React from 'react';

const HeaderDemo: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '200vh',
      background: 'linear-gradient(135deg, #FFF9F5 0%, #FEF3E7 100%)',
      padding: '120px 20px 40px'
    }}>
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ 
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#043E52',
            marginBottom: '16px'
          }}>
            🎨 Header Aprimorado
          </h1>
          <p style={{ 
            fontSize: '1.25rem',
            color: '#6B7280',
            maxWidth: '800px',
            margin: '0 auto 32px'
          }}>
            Navegação moderna com animações fluidas, mega menu interativo e design responsivo
          </p>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
          marginBottom: '80px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #E16A3D 0%, #FEA450 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '24px' }}>🎯</span>
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#043E52',
              marginBottom: '12px'
            }}>
              Mega Menu Interativo
            </h3>
            <p style={{ color: '#6B7280', lineHeight: '1.6' }}>
              Dropdown expansivo com categorias organizadas, ícones coloridos e links diretos para produtos específicos.
            </p>
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #016A6D 0%, #22C55E 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '24px' }}>✨</span>
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#043E52',
              marginBottom: '12px'
            }}>
              Animações Fluidas
            </h3>
            <p style={{ color: '#6B7280', lineHeight: '1.6' }}>
              Transições suaves, efeitos de hover, gradientes que seguem o mouse e animações de scroll.
            </p>
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #FEA450 0%, #22C55E 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '24px' }}>📱</span>
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#043E52',
              marginBottom: '12px'
            }}>
              Mobile First
            </h3>
            <p style={{ color: '#6B7280', lineHeight: '1.6' }}>
              Menu mobile com accordion, navegação touch-friendly e design responsivo completo.
            </p>
          </div>
        </div>

        {/* Interactive Demo Section */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '48px',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E7EB',
          marginBottom: '60px'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#043E52',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            🎮 Teste as Funcionalidades
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <div style={{
              padding: '24px',
              background: '#FFF9F5',
              borderRadius: '16px',
              border: '2px solid #FEA450'
            }}>
              <h4 style={{ color: '#E16A3D', marginBottom: '12px' }}>🖱️ Hover no Menu</h4>
              <p style={{ color: '#043E52', fontSize: '14px' }}>
                Passe o mouse sobre "Shop" para ver o mega menu com categorias organizadas
              </p>
            </div>

            <div style={{
              padding: '24px',
              background: '#F0FDF4',
              borderRadius: '16px',
              border: '2px solid #22C55E'
            }}>
              <h4 style={{ color: '#16A34A', marginBottom: '12px' }}>📱 Menu Mobile</h4>
              <p style={{ color: '#043E52', fontSize: '14px' }}>
                Redimensione a tela ou use mobile para ver o menu accordion
              </p>
            </div>

            <div style={{
              padding: '24px',
              background: '#FEF3E7',
              borderRadius: '16px',
              border: '2px solid #FEA450'
            }}>
              <h4 style={{ color: '#E16A3D', marginBottom: '12px' }}>🔍 Busca</h4>
              <p style={{ color: '#043E52', fontSize: '14px' }}>
                Clique no ícone de busca para abrir o overlay de pesquisa
              </p>
            </div>

            <div style={{
              padding: '24px',
              background: '#EFF6FF',
              borderRadius: '16px',
              border: '2px solid #3B82F6'
            }}>
              <h4 style={{ color: '#2563EB', marginBottom: '12px' }}>🛒 Carrinho</h4>
              <p style={{ color: '#043E52', fontSize: '14px' }}>
                Clique no carrinho para ver a animação e badge de itens
              </p>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #E16A3D 0%, #FEA450 100%)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
              🎨 Design System
            </h3>
            <p style={{ opacity: 0.9, marginBottom: '20px' }}>
              Paleta de cores consistente e animações premium
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                Primary: #E16A3D
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                Secondary: #FEA450
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                Accent: #016A6D
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Test Section */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E7EB',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#043E52',
            marginBottom: '16px'
          }}>
            📜 Teste de Scroll
          </h2>
          <p style={{ color: '#6B7280', marginBottom: '32px' }}>
            Role a página para ver o efeito de transparência e mudança de altura do header
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} style={{
                height: '120px',
                background: `linear-gradient(135deg, #E16A3D${20 + i * 10} 0%, #FEA450${20 + i * 10} 100%)`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                Card {i + 1}
              </div>
            ))}
          </div>

          <div style={{
            background: '#F9FAFB',
            borderRadius: '12px',
            padding: '24px',
            border: '2px dashed #D1D5DB'
          }}>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>
              Continue rolando para ver mais efeitos do header...
            </p>
          </div>
        </div>

        {/* Spacer for scroll test */}
        <div style={{ height: '100vh' }} />
      </div>
    </div>
  );
};

export default HeaderDemo;