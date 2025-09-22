import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  delay?: number;
  duration?: number;
  className?: string;
}

export default function ScrollReveal({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.6,
  className = '' 
}: ScrollRevealProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-50px 0px',
  });

  const getVariants = () => {
    const hidden: any = {
      opacity: 0,
    };
    
    const visible: any = {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
    };

    if (direction === 'up') hidden.y = 60;
    if (direction === 'down') hidden.y = -60;
    if (direction === 'left') hidden.x = -60;
    if (direction === 'right') hidden.x = 60;
    if (direction === 'scale') hidden.scale = 0.8;

    return { hidden, visible };
  };

  const variants = getVariants();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}