import React from 'react';
import AddToCartButtonDemo from '../components/ui/AddToCartButtonDemo';

const ButtonDemo: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF9F5 0%, #FEF3E7 100%)'
    }}>
      <AddToCartButtonDemo />
    </div>
  );
};

export default ButtonDemo;