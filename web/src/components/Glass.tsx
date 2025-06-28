import React from 'react';
import { Box, BoxProps } from '@mantine/core';
import { useGlassmorphism } from './GameRender';

interface GlassProps extends BoxProps {
  children?: React.ReactNode;
  onClick?: () => void;
}

const Glass: React.FC<GlassProps> = ({ children, onClick, ...props }) => {
  // Use glassmorphism hook to show game background
  useGlassmorphism();
  
  return (
    <Box
      onClick={onClick}
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 'var(--border-radius)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        ...props.style,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default Glass; 