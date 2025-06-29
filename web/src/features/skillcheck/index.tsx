import { useRef, useState } from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import Indicator from './indicator';
import { fetchNui } from '../../utils/fetchNui';
import { Box, createStyles, keyframes } from '@mantine/core';
import { motion } from 'framer-motion';
import React from 'react';
import type { GameDifficulty, SkillCheckProps } from '../../typings';
import { useGlassStyle } from '../../hooks/useGlassStyle';

export const circleCircumference = 2 * 50 * Math.PI;

// Updated angle generation to ensure indicator starts far from skill zone
const getRandomAngle = (min: number, max: number, minDistance: number = 90) => {
  // Generate angle ensuring it's at least minDistance away from starting position (-90 degrees)
  const startPos = -90;
  let angle;
  do {
    angle = Math.floor(Math.random() * (max - min)) + min;
  } while (Math.abs(angle - startPos) < minDistance && Math.abs(angle - startPos) > (360 - minDistance));
  
  return angle;
};

const difficultyOffsets = {
  easy: 50,
  medium: 40,
  hard: 25,
};

const breathe = keyframes({
  '0%, 100%': {
    transform: 'scale(1)',
    opacity: 0.95,
  },
  '50%': {
    transform: 'scale(1.02)',
    opacity: 1,
  },
});

const slideInScale = keyframes({
  '0%': {
    transform: 'scale(0.3) rotate(180deg)',
    opacity: 0,
  },
  '50%': {
    transform: 'scale(1.1) rotate(0deg)',
    opacity: 0.9,
  },
  '70%': {
    transform: 'scale(0.95) rotate(0deg)',
    opacity: 1,
  },
  '100%': {
    transform: 'scale(1) rotate(0deg)',
    opacity: 1,
  },
});

const slideOutScale = keyframes({
  '0%': {
    transform: 'scale(1) rotate(0deg)',
    opacity: 1,
  },
  '100%': {
    transform: 'scale(0.3) rotate(-180deg)',
    opacity: 0,
  },
});

// Dynamic Particle System Component for skill check background
const SkillCheckParticleSystem: React.FC = () => {
  const particles = React.useMemo(() => {
    return Array.from({ length: 70 }, (_, i) => {
      const isBigParticle = i < 10; // First 10 are bigger particles
      return {
        id: i,
        angle: (i / 70) * 360,
        radius: 80 + Math.random() * 50, // Larger range for more variety
        size: isBigParticle 
          ? Math.random() * 3 + 2 // Big particles: 2-5px
          : Math.random() * 2 + 0.5, // Normal particles: 0.5-2.5px
        duration: Math.random() * 4 + 3,
        delay: Math.random() * 2,
        isThemeColor: Math.random() > 0.3, // Even more theme colored particles (70%)
      };
    });
  }, []);

  return (
    <div style={{ 
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)',
      width: 300,
      height: 300,
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
                ? '0 0 8px var(--mantine-primary-color)' 
                : '0 0 6px rgba(255, 255, 255, 0.6)',
            }}
            animate={{
              x: [x, x + 20, x - 10, x + 15, x],
              y: [y, y - 25, y + 15, y - 20, y],
              opacity: [0.2, 1, 0.4, 0.9, 0.2],
              scale: [1, 1.5, 0.6, 1.4, 1],
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

const useStyles = createStyles((theme, params: { difficultyOffset: number; isExiting: boolean; glass: ReturnType<typeof useGlassStyle> }) => {
  // Convert theme color hex to RGB for glow effects
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 239, g: 68, b: 68 }; // fallback to red
  };

  const themeColor = theme.colors[theme.primaryColor][theme.fn.primaryShade()];
  const rgb = hexToRgb(themeColor);

  return {
    // Positioning wrapper - handles centering only
    positionWrapper: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '300px',
      height: '300px',
      pointerEvents: 'none', // Allow clicks to pass through to container
    },

    // Main glassmorphism container - handles animations only
    container: {
      position: 'relative',
      width: '100%',
      height: '100%',
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
      border: `2px solid ${themeColor}`, 
      boxShadow: params.glass.isDarkMode ? `
        0 12px 40px rgba(0, 0, 0, 0.7),
        0 6px 20px rgba(0, 0, 0, 0.6),
        0 0 30px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        inset 0 -1px 0 rgba(0, 0, 0, 0.4)
      ` : `
        0 12px 40px rgba(0, 0, 0, 0.5),
        0 6px 20px rgba(0, 0, 0, 0.4),
        0 0 30px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.4),
        inset 0 -1px 0 rgba(0, 0, 0, 0.2)
      `,
      borderRadius: '50%', // Circular container
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Roboto',
      overflow: 'hidden',
      pointerEvents: 'auto', 
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
          radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.10) 0%, transparent 50%),
          radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 40%)
        `,
        borderRadius: 'inherit',
        animation: `${breathe} 3s ease-in-out infinite`,
        zIndex: -1,
        pointerEvents: 'none',
      },
      animation: params.isExiting 
        ? `${slideOutScale} 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards`
        : `${slideInScale} 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards`,
    },

    // SVG container - smaller
    svgContainer: {
      position: 'relative',
      width: '250px',
      height: '250px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    svg: {
      width: '100%',
      height: '100%',
      r: 50,
    },

    // Background track circle
    track: {
      fill: 'transparent',
      stroke: 'rgba(255, 255, 255, 0.15)',
      strokeWidth: 8,
      r: 50,
      cx: 125,
      cy: 125,
      strokeDasharray: circleCircumference,
      filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.1))',
      '@media (min-height: 1440px)': {
        strokeWidth: 10,
        r: 65,
        strokeDasharray: 2 * 65 * Math.PI,
      },
    },

    // Skill check target area
    skillArea: {
      fill: 'transparent',
      stroke: themeColor,
      strokeWidth: 8,
      r: 50,
      cx: 125,
      cy: 125,
      strokeDasharray: circleCircumference,
      strokeDashoffset: circleCircumference - (Math.PI * 50 * params.difficultyOffset) / 180,
      filter: `drop-shadow(0 0 15px ${themeColor}) drop-shadow(0 0 30px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6))`,
      strokeLinecap: 'round' as const,
      '@media (min-height: 1440px)': {
        strokeWidth: 10,
        r: 65,
        strokeDasharray: 2 * 65 * Math.PI,
        strokeDashoffset: 2 * 65 * Math.PI - (Math.PI * 65 * params.difficultyOffset) / 180,
      },
    },

    // Moving indicator
    indicator: {
      stroke: '#ffffff',
      strokeWidth: 6,
      fill: 'transparent',
      r: 50,
      cx: 125,
      cy: 125,
      strokeDasharray: circleCircumference,
      strokeDashoffset: circleCircumference - 6,
      filter: 'drop-shadow(0 0 12px #ffffff) drop-shadow(0 0 24px rgba(255, 255, 255, 0.8))',
      strokeLinecap: 'round' as const,
      '@media (min-height: 1440px)': {
        strokeWidth: 8,
        r: 65,
        strokeDasharray: 2 * 65 * Math.PI,
        strokeDashoffset: 2 * 65 * Math.PI - 8,
      },
    },

    // Center button - adjusted for smaller container
    button: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: '60px',
      height: '60px',
      background: 'rgba(255, 255, 255, 0.15)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: `0 8px 24px rgba(0, 0, 0, 0.2), inset 0 2px 0 rgba(255, 255, 255, 0.2), 0 0 20px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`,
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '20px',
      fontWeight: 700,
      fontFamily: 'Roboto',
      color: '#ffffff',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
      letterSpacing: '1px',
      textTransform: 'uppercase' as const,
      zIndex: 20,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(135deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1), transparent)`,
        borderRadius: 'inherit',
        zIndex: -1,
      },
      '@media (min-height: 1440px)': {
        width: '80px',
        height: '80px',
        fontSize: '24px',
      },
    },
  };
});

const SkillCheck: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [preWarm, setPreWarm] = useState(false); // Pre-warm glassmorphism
  const dataRef = useRef<{ difficulty: GameDifficulty | GameDifficulty[]; inputs?: string[] } | null>(null);
  const dataIndexRef = useRef<number>(0);
  const [skillCheck, setSkillCheck] = useState<SkillCheckProps>({
    angle: 0,
    difficultyOffset: 50,
    difficulty: 'easy',
    key: 'e',
  });
  const glass = useGlassStyle();
  const { classes } = useStyles({ difficultyOffset: skillCheck.difficultyOffset, isExiting, glass });

  // Enable glassmorphism when skillcheck is visible OR pre-warming
  // useConditionalGlassmorphism(visible || preWarm, 'SkillCheck');

  useNuiEvent('startSkillCheck', (data: { difficulty: GameDifficulty | GameDifficulty[]; inputs?: string[] }) => {
    dataRef.current = data;
    dataIndexRef.current = 0;
    const gameData = Array.isArray(data.difficulty) ? data.difficulty[0] : data.difficulty;
    const offset = typeof gameData === 'object' ? gameData.areaSize : difficultyOffsets[gameData];
    const randomKey = data.inputs ? data.inputs[Math.floor(Math.random() * data.inputs.length)] : 'e';
    
    // Generate angle ensuring good distance from starting position
    const skillZoneAngle = -90 + getRandomAngle(140, 300, 120); // Ensure at least 120 degrees from start
    
    setSkillCheck({
      angle: skillZoneAngle,
      difficultyOffset: offset,
      difficulty: gameData,
      keys: data.inputs?.map((input) => input.toLowerCase()),
      key: randomKey.toLowerCase(),
    });

    // Pre-warm glassmorphism for instant canvas availability
    setPreWarm(true);
    
    // Small delay to ensure canvas is ready, then show skillcheck
    setTimeout(() => {
      setIsExiting(false);
      setVisible(true);
      setPreWarm(false); // Stop pre-warming, visible takes over
    }, 50); // 50ms pre-warm for instant appearance
  });

  useNuiEvent('skillCheckCancel', () => {
    setIsExiting(true);
    setPreWarm(false); // Stop pre-warming
    setTimeout(() => {
      setVisible(false);
      setIsExiting(false);
    }, 400);
    fetchNui('skillCheckOver', false);
  });

  const handleComplete = (success: boolean) => {
    if (!dataRef.current) return;
    if (!success || !Array.isArray(dataRef.current.difficulty)) {
      setIsExiting(true);
      setPreWarm(false); // Stop pre-warming
      setTimeout(() => {
        setVisible(false);
        setIsExiting(false);
      }, 400);
      return fetchNui('skillCheckOver', success);
    }

    if (dataIndexRef.current >= dataRef.current.difficulty.length - 1) {
      setIsExiting(true);
      setPreWarm(false); // Stop pre-warming
      setTimeout(() => {
        setVisible(false);
        setIsExiting(false);
      }, 400);
      return fetchNui('skillCheckOver', success);
    }

    dataIndexRef.current++;
    const data = dataRef.current.difficulty[dataIndexRef.current];
    const key = dataRef.current.inputs
      ? dataRef.current.inputs[Math.floor(Math.random() * dataRef.current.inputs.length)]
      : 'e';
    const offset = typeof data === 'object' ? data.areaSize : difficultyOffsets[data];
    
    // Generate angle ensuring good distance from starting position for subsequent skill checks
    const skillZoneAngle = -90 + getRandomAngle(140, 300, 120);
    
    setSkillCheck((prev) => ({
      ...prev,
      angle: skillZoneAngle,
      difficultyOffset: offset,
      difficulty: data,
      key: key.toLowerCase(),
    }));
  };

  return (
    <>
      {visible && (
        <div className={classes.positionWrapper}>
          <Box className={classes.container}>
            <SkillCheckParticleSystem />
            <div className={classes.svgContainer}>
              <svg className={classes.svg} viewBox="0 0 250 250">
                {/* Background track */}
                <circle className={classes.track} />
                {/* Skill check target area */}
                <circle transform={`rotate(${skillCheck.angle}, 125, 125)`} className={classes.skillArea} />
                {/* Moving indicator */}
                <Indicator
                  angle={skillCheck.angle}
                  offset={skillCheck.difficultyOffset}
                  multiplier={
                    skillCheck.difficulty === 'easy'
                      ? 1
                      : skillCheck.difficulty === 'medium'
                      ? 1.5
                      : skillCheck.difficulty === 'hard'
                      ? 1.75
                      : skillCheck.difficulty.speedMultiplier
                  }
                  handleComplete={handleComplete}
                  className={classes.indicator}
                  skillCheck={skillCheck}
                />
              </svg>
              {/* Center button */}
              <Box className={classes.button}>{skillCheck.key.toUpperCase()}</Box>
            </div>
          </Box>
        </div>
      )}
    </>
  );
};

export default SkillCheck;
