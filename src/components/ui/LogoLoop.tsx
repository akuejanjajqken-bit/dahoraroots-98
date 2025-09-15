import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface Logo {
  src: string;
  alt: string;
  href?: string;
}

interface LogoLoopProps {
  logos: Logo[];
  speed?: number;
  direction?: 'left' | 'right';
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  className?: string;
}

const LogoLoop: React.FC<LogoLoopProps> = ({
  logos,
  speed = 50,
  direction = 'left',
  logoHeight = 80,
  gap = 60,
  pauseOnHover = true,
  fadeOut = false,
  fadeOutColor = '#ffffff',
  scaleOnHover = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Calculate total width needed for logos
  const totalLogosWidth = useMemo(() => {
    return logos.length * (logoHeight + gap);
  }, [logos.length, logoHeight, gap]);

  // Calculate how many copies we need to fill the container plus extra for seamless loop
  const copies = useMemo(() => {
    if (containerWidth === 0) return 2;
    return Math.ceil((containerWidth * 2) / totalLogosWidth) + 1;
  }, [containerWidth, totalLogosWidth]);

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Handle mouse events for pause on hover
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  }, [pauseOnHover]);

  // Animation duration based on speed
  const animationDuration = useMemo(() => {
    return totalLogosWidth / speed;
  }, [totalLogosWidth, speed]);

  // Create repeated logo array
  const repeatedLogos = useMemo(() => {
    const repeated = [];
    for (let i = 0; i < copies; i++) {
      repeated.push(...logos);
    }
    return repeated;
  }, [logos, copies]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: `${logoHeight}px`,
    maskImage: fadeOut
      ? `linear-gradient(to right, transparent, ${fadeOutColor} 10%, ${fadeOutColor} 90%, transparent)`
      : undefined,
    WebkitMaskImage: fadeOut
      ? `linear-gradient(to right, transparent, ${fadeOutColor} 10%, ${fadeOutColor} 90%, transparent)`
      : undefined,
  };

  const trackStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: `${gap}px`,
    animation: isPaused ? 'none' : `logoLoop${direction === 'left' ? 'Left' : 'Right'} ${animationDuration}s linear infinite`,
  };

  const logoStyle: React.CSSProperties = {
    height: `${logoHeight}px`,
    width: 'auto',
    flexShrink: 0,
    transition: scaleOnHover ? 'transform 0.3s ease' : undefined,
  };

  const logoHoverStyle: React.CSSProperties = scaleOnHover
    ? { transform: 'scale(1.1)' }
    : {};

  return (
    <>
      <style>
        {`
          @keyframes logoLoopLeft {
            from {
              transform: translateX(0%);
            }
            to {
              transform: translateX(-${(100 / copies)}%);
            }
          }

          @keyframes logoLoopRight {
            from {
              transform: translateX(-${(100 / copies)}%);
            }
            to {
              transform: translateX(0%);
            }
          }
        `}
      </style>
      <div
        ref={containerRef}
        className={className}
        style={containerStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div style={trackStyle}>
          {repeatedLogos.map((logo, index) => (
            <div
              key={`${logo.alt}-${index}`}
              style={{ flexShrink: 0 }}
              onMouseEnter={(e) => {
                if (scaleOnHover) {
                  Object.assign(e.currentTarget.querySelector('img')!.style, logoHoverStyle);
                }
              }}
              onMouseLeave={(e) => {
                if (scaleOnHover) {
                  e.currentTarget.querySelector('img')!.style.transform = 'scale(1)';
                }
              }}
            >
              {logo.href ? (
                <a
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'block' }}
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    style={logoStyle}
                  />
                </a>
              ) : (
                <img
                  src={logo.src}
                  alt={logo.alt}
                  style={logoStyle}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LogoLoop;