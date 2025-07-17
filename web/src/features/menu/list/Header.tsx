import { Box, createStyles, Text, keyframes } from '@mantine/core';
import React from 'react';
import { useGlassStyle } from '../../../hooks/useGlassStyle';
import { useSafeTheme } from '../../../hooks/useSafeTheme';

const horizontalPulse = keyframes({
  '0%': {
    transform: 'translateX(0)', 
  },
  '50%': {
    transform: 'translateX(260px)', 
  },
  '100%': {
    transform: 'translateX(0)', 
  },
});

const useStyles = createStyles((theme, params: { glass: ReturnType<typeof useGlassStyle> }) => {
  const safeTheme = useSafeTheme();
  
  return {
    container: {
      position: 'relative',
      textAlign: 'center',
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      // Fake glassmorphism - no backdrop-filter to prevent black background
      background: params.glass.isDarkMode ? `
        linear-gradient(135deg, 
          rgba(0, 0, 0, 0.25) 0%,
          rgba(0, 0, 0, 0.18) 25%,
          rgba(0, 0, 0, 0.12) 50%,
          rgba(0, 0, 0, 0.08) 75%,
          rgba(0, 0, 0, 0.15) 100%
        ),
        linear-gradient(45deg,
          rgba(20, 20, 20, 0.4) 0%,
          rgba(10, 10, 10, 0.5) 50%,
          rgba(0, 0, 0, 0.6) 100%
        )
      ` : `
        linear-gradient(160deg, 
          rgba(255, 255, 255, 0.18) 0%,
          rgba(255, 255, 255, 0.12) 50%,
          rgba(255, 255, 255, 0.15) 100%
        ),
        linear-gradient(20deg,
          rgba(255, 255, 255, 0.20) 0%,
          rgba(255, 255, 255, 0.25) 50%,
          rgba(255, 255, 255, 0.22) 100%
        )
      `,
      height: 60,
      width: 384,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: `1px solid ${params.glass.isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.2)'}`,
      borderBottom: 'none',
      boxShadow: params.glass.isDarkMode ? `
        0 12px 40px rgba(0, 0, 0, 0.7),
        0 6px 20px rgba(0, 0, 0, 0.6),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        inset 0 -1px 0 rgba(0, 0, 0, 0.4)
      ` : '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: params.glass.isDarkMode ? `
          radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.04) 0%, transparent 50%),
          radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 40%)
        ` : `
          radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.04) 0%, transparent 40%)
        `,
        borderRadius: 'inherit',
        zIndex: -1,
        pointerEvents: 'none',
      },
    },
    heading: {
      fontSize: 24,
      textTransform: 'uppercase',
      fontWeight: 500,
      fontFamily: 'Roboto',
      color: '#ffffff',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
      letterSpacing: '0.5px',
      zIndex: 2,
      position: 'relative',
    },
    horizontalPulse: {
      position: 'absolute',
      bottom: '4px', 
      left: '0px', 
      width: '120px', 
      height: '3px', 
      background: `linear-gradient(90deg, transparent, ${safeTheme.colors[safeTheme.primaryColor][safeTheme.fn.primaryShade()]}, ${safeTheme.colors[safeTheme.primaryColor][safeTheme.fn.primaryShade()]}, transparent)`,
      boxShadow: `0 0 20px ${safeTheme.colors[safeTheme.primaryColor][safeTheme.fn.primaryShade()]}`, 
      borderRadius: '2px', 
      animation: `${horizontalPulse} 5s linear infinite`, 
      zIndex: 10, 
    },
  };
});

const Header: React.FC<{ title: string }> = ({ title }) => {
  const glass = useGlassStyle();
  const { classes } = useStyles({ glass });

  return (
    <Box className={classes.container}>
      <Text className={classes.heading}>{title}</Text>
      <div className={classes.horizontalPulse} />
    </Box>
  );
};

export default React.memo(Header);
