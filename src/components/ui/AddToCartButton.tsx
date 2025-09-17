import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  stock?: number;
}

interface AddToCartButtonProps {
  product: Product;
  variant?: 'primary' | 'secondary' | 'minimal' | 'floating';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  onAddToCart?: (product: Product) => void;
  quantity?: number;
  showQuantitySelector?: boolean;
  disabled?: boolean;
  className?: string;
}

type ButtonState = 'idle' | 'loading' | 'success';

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  onAddToCart,
  quantity = 1,
  showQuantitySelector = false,
  disabled = false,
  className = ''
}) => {
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleIdRef = useRef(0);

  // Size configurations
  const sizes = {
    small: { 
      padding: '10px 20px', 
      fontSize: '14px', 
      iconSize: 16,
      minHeight: '40px',
      borderRadius: '8px'
    },
    medium: { 
      padding: '14px 28px', 
      fontSize: '16px', 
      iconSize: 20,
      minHeight: '48px',
      borderRadius: '12px'
    },
    large: { 
      padding: '18px 36px', 
      fontSize: '18px', 
      iconSize: 24,
      minHeight: '56px',
      borderRadius: '16px'
    }
  };

  // Variant styles
  const getVariantStyles = () => {
    const baseStyles = {
      position: 'relative' as const,
      overflow: 'hidden' as const,
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'inherit',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.025em',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      userSelect: 'none' as const,
      WebkitTapHighlightColor: 'transparent',
      ...sizes[size]
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          background: disabled 
            ? 'linear-gradient(135deg, #9CA3AF 0%, #D1D5DB 100%)'
            : 'linear-gradient(135deg, #E16A3D 0%, #FEA450 100%)',
          color: '#FFFFFF',
          boxShadow: disabled 
            ? '0 2px 8px rgba(156, 163, 175, 0.2)'
            : '0 4px 14px rgba(225, 106, 61, 0.3)',
          transform: isHovered && !disabled ? 'translateY(-2px)' : 'translateY(0)',
          boxShadow: isHovered && !disabled 
            ? '0 8px 25px rgba(225, 106, 61, 0.4)'
            : disabled 
              ? '0 2px 8px rgba(156, 163, 175, 0.2)'
              : '0 4px 14px rgba(225, 106, 61, 0.3)'
        };
      
      case 'secondary':
        return {
          ...baseStyles,
          background: 'transparent',
          color: disabled ? '#9CA3AF' : '#E16A3D',
          border: `2px solid ${disabled ? '#9CA3AF' : '#E16A3D'}`,
          boxShadow: 'none',
          transform: isHovered && !disabled ? 'translateY(-1px)' : 'translateY(0)',
          '&:hover': {
            background: disabled ? 'transparent' : '#E16A3D',
            color: '#FFFFFF'
          }
        };
      
      case 'minimal':
        return {
          ...baseStyles,
          background: disabled ? '#F3F4F6' : '#FFF9F5',
          color: disabled ? '#9CA3AF' : '#043E52',
          border: `1px solid ${disabled ? '#D1D5DB' : '#E5E7EB'}`,
          boxShadow: 'none',
          transform: isHovered && !disabled ? 'translateY(-1px)' : 'translateY(0)',
          '&:hover': {
            background: disabled ? '#F3F4F6' : '#FEF3E7',
            borderColor: disabled ? '#D1D5DB' : '#E16A3D'
          }
        };
      
      case 'floating':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #E16A3D 0%, #FEA450 100%)',
          color: '#FFFFFF',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          padding: '0',
          minHeight: '56px',
          boxShadow: '0 8px 25px rgba(225, 106, 61, 0.4)',
          position: 'fixed' as const,
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          transform: isHovered && !disabled ? 'translateY(-3px) scale(1.05)' : 'translateY(0) scale(1)'
        };
      
      default:
        return baseStyles;
    }
  };

  // Create ripple effect
  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || buttonState !== 'idle') return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple = {
      id: rippleIdRef.current++,
      x,
      y
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 850);
  };

  // Handle button click
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || buttonState !== 'idle') return;

    createRipple(event);
    setButtonState('loading');

    // Simulate API call
    try {
      if (onAddToCart) {
        await onAddToCart(product);
      }
      
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setButtonState('success');
      
      // Return to idle after 2 seconds
      setTimeout(() => {
        setButtonState('idle');
      }, 2000);
    } catch (error) {
      setButtonState('idle');
      console.error('Error adding to cart:', error);
    }
  };

  // Handle keyboard events
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(event as any);
    }
  };

  // Get button content based on state
  const getButtonContent = () => {
    const iconSize = sizes[size].iconSize;

    switch (buttonState) {
      case 'loading':
        return (
          <>
            <Loader2 
              size={iconSize} 
              style={{ 
                animation: 'spin 1s linear infinite',
                marginRight: '8px'
              }} 
            />
            Adicionando...
          </>
        );
      
      case 'success':
        return (
          <>
            <Check 
              size={iconSize} 
              style={{ 
                animation: 'checkmark 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                marginRight: '8px'
              }} 
            />
            Adicionado!
          </>
        );
      
      default:
        return (
          <>
            <ShoppingCart 
              size={iconSize} 
              style={{ 
                transform: isHovered ? 'rotate(-10deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                marginRight: '8px'
              }} 
            />
            Adicionar ao Carrinho
          </>
        );
    }
  };

  // Get button styles based on state
  const getButtonStyles = () => {
    const baseStyles = getVariantStyles();
    
    if (buttonState === 'success') {
      return {
        ...baseStyles,
        background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
        color: '#FFFFFF',
        boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)'
      };
    }

    return baseStyles;
  };

  const buttonStyles = getButtonStyles();

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes checkmark {
          0% { 
            transform: scale(0) rotate(45deg);
            opacity: 0;
          }
          50% { 
            transform: scale(1.2) rotate(45deg);
            opacity: 1;
          }
          100% { 
            transform: scale(1) rotate(45deg);
            opacity: 1;
          }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
        
        .add-to-cart-button {
          ${Object.entries(buttonStyles).map(([key, value]) => 
            `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`
          ).join('\n          ')}
        }
        
        .add-to-cart-button:focus-visible {
          outline: 3px solid #016A6D;
          outline-offset: 2px;
        }
        
        .add-to-cart-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transform: scale(0);
          animation: ripple 0.85s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }
        
        .shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }
        
        @media (max-width: 768px) {
          .add-to-cart-button {
            width: ${fullWidth ? '100%' : 'auto'};
            min-height: 44px;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .add-to-cart-button,
          .ripple,
          .shimmer {
            animation: none;
            transition: none;
          }
        }
      `}</style>
      
      <button
        ref={buttonRef}
        className={`add-to-cart-button ${className}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={disabled || buttonState === 'loading'}
        aria-label={
          buttonState === 'loading' 
            ? 'Adicionando produto ao carrinho...'
            : buttonState === 'success'
            ? 'Produto adicionado ao carrinho com sucesso!'
            : `Adicionar ${product.name} ao carrinho`
        }
        aria-pressed={buttonState === 'success'}
        style={{
          width: fullWidth ? '100%' : 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        {/* Ripple effects */}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="ripple"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20
            }}
          />
        ))}
        
        {/* Shimmer effect for loading state */}
        {buttonState === 'loading' && (
          <div
            className="shimmer"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: sizes[size].borderRadius
            }}
          />
        )}
        
        {/* Button content */}
        {getButtonContent()}
      </button>
    </>
  );
};

export default AddToCartButton;