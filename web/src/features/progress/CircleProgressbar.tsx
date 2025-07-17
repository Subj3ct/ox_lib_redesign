import React from 'react';
import { createStyles, keyframes, Stack, Text, Box } from '@mantine/core';
import { motion, useMotionValue, useTransform, animate, useMotionValueEvent } from 'framer-motion';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { CircleProgressbarProps } from '../../typings';
import { useGlassStyle } from '../../hooks/useGlassStyle';
import type { GlassStyle } from '../../hooks/useGlassStyle';

import { useSafeTheme } from '../../hooks/useSafeTheme';

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
    transform: 'translateY(20px) scale(0.9)',
    opacity: 0,
  },
  '60%': {
    transform: 'translateY(-5px) scale(1.05)',
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
    transform: 'translateY(20px) scale(0.9)',
    opacity: 0,
  },
});

const CircularParticleSystem: React.FC = () => {
  const particles = React.useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      angle: (i / 30) * 360,
      radius: 40 + Math.random() * 20,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 2,
      isThemeColor: Math.random() > 0.5,
    }));
  }, []);

  return (
    <div style={{ 
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)',
      width: 140,
      height: 140,
      pointerEvents: 'none'
    }}>
      {particles.map((particle) => {
        const x = Math.cos((particle.angle * Math.PI) / 180) * particle.radius;
        const y = Math.sin((particle.angle * Math.PI) / 180) * particle.radius;
        
        return (
          <motion.div
            key={particle.id}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.isThemeColor ? 'var(--mantine-primary-color)' : 'rgba(255, 255, 255, 0.8)',
              borderRadius: '50%',
              boxShadow: particle.isThemeColor 
                ? '0 0 6px var(--mantine-primary-color)' 
                : '0 0 4px rgba(255, 255, 255, 0.6)',
            }}
            animate={{
              x: [x, x + 10, x - 5, x + 8, x],
              y: [y, y - 15, y + 8, y - 12, y],
              opacity: [0.3, 0.9, 0.5, 0.8, 0.3],
              scale: [1, 1.3, 0.8, 1.2, 1],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};

const useStyles = createStyles((theme, { position, duration, glass }: { position: 'middle' | 'bottom'; duration: number; glass: GlassStyle }) => ({
  container: {
    width: '100%',
    height: position === 'middle' ? '100%' : '20%',
    bottom: 0,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'Roboto',
    background: glass.isDarkMode ? `
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
      linear-gradient(135deg, 
        rgba(255, 255, 255, 0.25) 0%,
        rgba(255, 255, 255, 0.18) 25%,
        rgba(255, 255, 255, 0.12) 50%,
        rgba(255, 255, 255, 0.08) 75%,
        rgba(255, 255, 255, 0.15) 100%
      ),
      linear-gradient(45deg,
        rgba(120, 120, 120, 0.4) 0%,
        rgba(100, 100, 100, 0.5) 50%,
        rgba(80, 80, 80, 0.6) 100%
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
    borderRadius: '20px',
    padding: '24px',
    animation: `${breathe} 3s ease-in-out infinite`,
    marginTop: position === 'middle' ? 0 : undefined,
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
  wrapperEntering: {
    animation: `${slideInScale} 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, ${breathe} 3s ease-in-out infinite 0.7s`,
  },
  wrapperExiting: {
    animation: `${slideOutScale} 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
  },
  content: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  progressRing: {
    position: 'relative',
    width: 120,
    height: 120,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: '24px',
    fontWeight: 700,
    fontFamily: 'Roboto Mono',
    color: '#ffffff',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
    letterSpacing: '1px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    maxWidth: '200px',
    lineHeight: 1.4,
  },
}));

const CircleProgressbar: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [progressDuration, setProgressDuration] = React.useState(0);
  const [position, setPosition] = React.useState<'middle' | 'bottom'>('middle');
  const [label, setLabel] = React.useState('');
  const theme = useSafeTheme();
  const glass = useGlassStyle();
  const { classes, cx } = useStyles({ position, duration: progressDuration, glass });
  
  const progress = useMotionValue(0);
  const percentage = useTransform(progress, [0, 1], [0, 100]);
  const [currentPercentage, setCurrentPercentage] = React.useState(0);
  
  // Add cleanup for potential race conditions
  const cancelRef = React.useRef<boolean>(false);
  const animationRef = React.useRef<any>(null);
  
  // Get safe theme color
  const safeThemeColor = theme.colors?.[theme.primaryColor]?.[theme.fn?.primaryShade() ?? 8] ?? '#ef4444';
  
  useMotionValueEvent(percentage, "change", (latest) => {
    setCurrentPercentage(Math.round(latest));
  });

  useNuiEvent('progressCancel', () => {
    cancelRef.current = true;
    if (animationRef.current) {
      animationRef.current.stop();
    }
    progress.set(1);
    setVisible(false);
  });

  useNuiEvent<CircleProgressbarProps>('circleProgress', (data) => {
    // Prevent race condition if already visible
    if (visible && !cancelRef.current) return;
    
    // Reset cancel flag and animation
    cancelRef.current = false;
    if (animationRef.current) {
      animationRef.current.stop();
    }
    
    setVisible(true);
    setLabel(data.label || '');
    setProgressDuration(data.duration);
    setPosition(data.position || 'middle');
    
    progress.set(0);
    setCurrentPercentage(0);
    
    animationRef.current = animate(progress, 1, {
      duration: data.duration / 1000, // Convert to seconds
      ease: "linear",
      onComplete: () => {
        if (!cancelRef.current) {
          setVisible(false);
        }
      }
    });
  });

  return (
    <>
      <Stack spacing={0} className={classes.container}>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Box className={cx(classes.wrapper)}>
            <div className={classes.content}>
              {/* Custom SVG Progress Ring */}
              <div className={classes.progressRing}>
                {/* Particle System */}
                <CircularParticleSystem />
                
                {/* Progress Ring SVG */}
                <motion.svg
                  width={120}
                  height={120}
                  style={{ position: 'absolute', transform: 'rotate(-90deg)' }}
                >
                  {/* Background Circle */}
                  <circle
                    cx={60}
                    cy={60}
                    r={52}
                    fill="transparent"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth={8}
                  />
                  
                  {/* Gradient Definition */}
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={safeThemeColor} />
                      <stop offset="100%" stopColor={safeThemeColor} />
                    </linearGradient>
                  </defs>
                  
                  {/* Glow Effect Layers */}
                  <motion.circle
                    cx={60}
                    cy={60}
                    r={52}
                    fill="transparent"
                    stroke={safeThemeColor}
                    strokeWidth={16}
                    strokeLinecap="round"
                    style={{
                      opacity: 0.15,
                      filter: 'blur(8px)',
                      pathLength: progress,
                    }}
                    strokeDasharray={`${2 * Math.PI * 52}`}
                  />
                  <motion.circle
                    cx={60}
                    cy={60}
                    r={52}
                    fill="transparent"
                    stroke={safeThemeColor}
                    strokeWidth={12}
                    strokeLinecap="round"
                    style={{
                      opacity: 0.25,
                      filter: 'blur(4px)',
                      pathLength: progress,
                    }}
                    strokeDasharray={`${2 * Math.PI * 52}`}
                  />
                  
                  {/* Animated Progress Circle */}
                  <motion.circle
                    cx={60}
                    cy={60}
                    r={52}
                    fill="transparent"
                    stroke="url(#progressGradient)"
                    strokeWidth={8}
                    strokeLinecap="round"
                    style={{
                      pathLength: progress,
                    }}
                    strokeDasharray={`${2 * Math.PI * 52}`}
                  />
                </motion.svg>
                
                {/* Animated Percentage Text with Fade/Unblur Effect */}
                <motion.div
                  style={{
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    opacity: useTransform(percentage, [0, 30], [0, 1]),
                    filter: useTransform(percentage, [0, 50], ['blur(10px)', 'blur(0px)']),
                  }}
                >
                  <Text className={classes.value}>
                    {currentPercentage}%
                  </Text>
                </motion.div>
              </div>
              
              {/* Label */}
              {label && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Text className={classes.label}>{label}</Text>
                </motion.div>
              )}
            </div>
          </Box>
        </ScaleFade>
      </Stack>
    </>
  );
};

export default CircleProgressbar;
