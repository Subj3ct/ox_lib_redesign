import React from 'react';
import { Box, createStyles, Text, keyframes } from '@mantine/core';
import { motion } from 'framer-motion';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';
import { useGlassStyle } from '../../hooks/useGlassStyle';
import type { GlassStyle } from '../../hooks/useGlassStyle';

import { useSafeTheme } from '../../hooks/useSafeTheme';
import LibIcon from '../../components/LibIcon';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const breathe = keyframes({
  '0%, 100%': { 
    transform: 'scale(1)',
    opacity: 1,
  },
  '50%': { 
    transform: 'scale(1.005)',
    opacity: 0.95,
  },
});

const slideInScale = keyframes({
  '0%': {
    transform: 'translateY(20px) scale(0.95)',
    opacity: 0,
  },
  '60%': {
    transform: 'translateY(-3px) scale(1.02)',
    opacity: 0.9,
  },
  '100%': {
    transform: 'translateY(0px) scale(1)',
    opacity: 1,
  },
});

const slideOutScale = keyframes({
  '0%': {
    transform: 'translateY(0px) scale(1)',
    opacity: 1,
  },
  '100%': {
    transform: 'translateY(20px) scale(0.95)',
    opacity: 0,
  },
});

// Text breathing animation
const textPulse = keyframes({
  '0%, 100%': { 
    transform: 'scale(1)',
    opacity: 1,
  },
  '50%': { 
    transform: 'scale(1.02)',
    opacity: 0.9,
  },
});

// Scanning line animation that moves across the progress bar
const scanLine = keyframes({
  '0%': {
    transform: 'translateX(-100%)',
    opacity: 0,
  },
  '50%': {
    opacity: 1,
  },
  '100%': {
    transform: 'translateX(400px)',
    opacity: 0,
  },
});

// Floating particles animation
const floatParticles = keyframes({
  '0%, 100%': {
    transform: 'translateY(0px) translateX(0px)',
    opacity: 0.3,
  },
  '33%': {
    transform: 'translateY(-15px) translateX(10px)',
    opacity: 0.8,
  },
  '66%': {
    transform: 'translateY(-8px) translateX(-5px)',
    opacity: 0.6,
  },
});

const useStyles = createStyles((theme, { glass, safeThemeColor }: { glass: GlassStyle; safeThemeColor: string }) => {
  // Use safe theme color utility
  const themeColor = safeThemeColor;
  
  const progressGlow = keyframes({
    '0%, 100%': { 
      boxShadow: `0 0 20px rgba(${themeColor
        .replace('#', '')
        .match(/.{2}/g)
        ?.map(hex => parseInt(hex, 16))
        .join(', ') || '239, 68, 68'}, 0.4), 0 0 40px rgba(${themeColor
        .replace('#', '')
        .match(/.{2}/g)
        ?.map(hex => parseInt(hex, 16))
        .join(', ') || '239, 68, 68'}, 0.2)`,
    },
    '50%': { 
      boxShadow: `0 0 30px rgba(${themeColor
        .replace('#', '')
        .match(/.{2}/g)
        ?.map(hex => parseInt(hex, 16))
        .join(', ') || '239, 68, 68'}, 0.6), 0 0 60px rgba(${themeColor
        .replace('#', '')
        .match(/.{2}/g)
        ?.map(hex => parseInt(hex, 16))
        .join(', ') || '239, 68, 68'}, 0.3)`,
    },
  });

  return ({
  wrapper: {
    width: '100%',
    height: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    position: 'absolute',
    padding: '0 20px',
    paddingTop: '50px', // Add padding to accommodate icon and percentage above
  },
  container: {
    width: 400,
    height: 45,
    position: 'relative',
    overflow: 'visible',
    fontFamily: 'Roboto',
    background: glass.isDarkMode ? `
      linear-gradient(135deg, 
        rgba(45, 45, 45, 0.4) 0%,
        rgba(35, 35, 35, 0.3) 25%,
        rgba(40, 40, 40, 0.5) 50%,
        rgba(30, 30, 30, 0.6) 75%,
        rgba(38, 38, 38, 0.35) 100%
      ),
      linear-gradient(45deg,
        rgba(50, 50, 50, 0.3) 0%,
        rgba(42, 42, 42, 0.4) 50%,
        rgba(35, 35, 35, 0.5) 100%
      )
    ` : `
      linear-gradient(160deg, 
        rgba(255, 255, 255, 0.08) 0%,
        rgba(255, 255, 255, 0.05) 50%,
        rgba(255, 255, 255, 0.07) 100%
      ),
      linear-gradient(20deg,
        rgba(255, 255, 255, 0.10) 0%,
        rgba(255, 255, 255, 0.12) 50%,
        rgba(255, 255, 255, 0.11) 100%
      )
    `,
    border: `1px solid ${glass.isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)'}`,
    boxShadow: glass.isDarkMode ? `
      0 12px 40px rgba(0, 0, 0, 0.7),
      0 6px 20px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(0, 0, 0, 0.4)
    ` : `
      0 12px 40px rgba(0, 0, 0, 0.5),
      0 6px 20px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      inset 0 -1px 0 rgba(0, 0, 0, 0.2)
    `,
    borderRadius: '12px',
    animation: `${breathe} 3s ease-in-out infinite`,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: glass.isDarkMode ? `
        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.04) 0%, transparent 50%),
        radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 40%)
      ` : `
        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.06) 0%, transparent 40%)
      `,
      borderRadius: 'inherit',
      animation: `${breathe} 3s ease-in-out infinite`,
      zIndex: -1,
      pointerEvents: 'none',
    },
  },
  containerEntering: {
    animation: `${slideInScale} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, ${breathe} 3s ease-in-out infinite 0.6s`,
  },
  containerExiting: {
    animation: `${slideOutScale} 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    background: `linear-gradient(90deg, 
      rgba(${themeColor
        .replace('#', '')
        .match(/.{2}/g)
        ?.map(hex => parseInt(hex, 16))
        .join(', ') || '239, 68, 68'}, 0.7), 
      rgba(${themeColor
        .replace('#', '')
        .match(/.{2}/g)
        ?.map(hex => parseInt(hex, 16))
        .join(', ') || '239, 68, 68'}, 0.5))`,
    borderRadius: '12px',
    overflow: 'hidden',
    animation: `${progressGlow} 2.5s ease-in-out infinite`,
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '50%',
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1), transparent)',
      borderRadius: '12px 12px 0 0',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '3px',
      background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
      animation: `${scanLine} 3s ease-in-out infinite`,
      zIndex: 10,
      borderRadius: '1px',
      boxShadow: '0 0 10px rgba(255, 255, 255, 0.6)',
    },
  },
  labelWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
    label: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#ffffff',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
    letterSpacing: '0.5px',
    textAlign: 'center',
    maxWidth: '360px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textTransform: 'uppercase',
    // Animated text breathing effect
    animation: `${textPulse} 2.2s ease-in-out infinite`,
    position: 'relative',
    zIndex: 15,
  },
  topContainer: {
    position: 'absolute',
    top: '-30px',
    left: '0px',
    right: '0px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 999,
    height: '25px',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
  },

  percentageWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '30px',
    paddingLeft: '8px',
    paddingRight: '8px',
    position: 'relative',
    top: '5px',
    right: '-10px',
  },
  percentage: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#ffffff',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
    letterSpacing: '0.5px',
    minWidth: '50px',
    textAlign: 'center',
  },
  });
});

// Dynamic Particle System Component
const ParticleSystem: React.FC = () => {
  const particles = React.useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 0.5,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 4,
      isThemeColor: Math.random() > 0.6,
    }));
  }, []);

  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.isThemeColor ? 'var(--mantine-primary-color)' : 'rgba(255, 255, 255, 0.8)',
            borderRadius: '50%',
            boxShadow: particle.isThemeColor 
              ? '0 0 6px var(--mantine-primary-color)' 
              : '0 0 4px rgba(255, 255, 255, 0.6)',
          }}
          animate={{
            y: [0, -20, -10, -25, 0],
            x: [0, 10, -5, 8, 0],
            opacity: [0.3, 0.8, 0.6, 0.9, 0.3],
            scale: [1, 1.2, 0.8, 1.1, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const Progressbar: React.FC = () => {
  const glass = useGlassStyle();
  const theme = useSafeTheme();
  const safeThemeColor = theme.colors?.[theme.primaryColor]?.[theme.fn?.primaryShade() ?? 8] ?? '#ef4444';
  const { classes, cx } = useStyles({ glass, safeThemeColor });
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);
  const [icon, setIcon] = React.useState<IconProp>('clock');
  const [percentage, setPercentage] = React.useState(0);
  
  // Add cleanup for potential race conditions
  const cancelRef = React.useRef<boolean>(false);
  const startTimeRef = React.useRef<number>(0);
  const animationFrameRef = React.useRef<number>(0);
  
  // Update percentage in real-time
  const updatePercentage = React.useCallback(() => {
    if (!visible || cancelRef.current) return;
    
    const elapsed = Date.now() - startTimeRef.current;
    const currentPercentage = Math.min(Math.round((elapsed / duration) * 100), 100);
    
    setPercentage(currentPercentage);
    
    if (currentPercentage < 100) {
      animationFrameRef.current = requestAnimationFrame(updatePercentage);
    }
  }, [visible, duration]);

  React.useEffect(() => {
    if (visible && duration > 0) {
      startTimeRef.current = Date.now();
      setPercentage(0);
      animationFrameRef.current = requestAnimationFrame(updatePercentage);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [visible, duration, updatePercentage]);

  useNuiEvent('progressCancel', () => {
    cancelRef.current = true;
    setVisible(false);
    setPercentage(0);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  });

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    // Reset cancel flag and set new progress
    cancelRef.current = false;
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
    setIcon(data.icon || 'clock'); // Default to clock icon
    setPercentage(0);
  });

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Box className={cx(classes.container)}>
            {/* Top container with icon and percentage */}
            <Box className={classes.topContainer}>
              <Box className={classes.iconWrapper}>
                <LibIcon icon={icon} size="lg" style={{ color: '#ffffff' }} />
              </Box>
              <Box className={classes.percentageWrapper}>
                <Text className={classes.percentage}>{percentage}%</Text>
              </Box>
            </Box>
            
            {/* Progress Bar with particles inside */}
            <Box
              className={classes.progressBar}
              onAnimationEnd={() => {
                if (!cancelRef.current) {
                  setVisible(false);
                }
              }}
              sx={{
                animation: 'progress-bar linear',
                animationDuration: `${duration}ms`,
              }}
            >
              {/* Dynamic Particle System */}
              <ParticleSystem />
            </Box>
            
            {/* Label */}
            <Box className={classes.labelWrapper}>
              {label && <Text className={classes.label}>{label}</Text>}
            </Box>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default Progressbar;
