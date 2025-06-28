import { Box, createStyles, Text, keyframes } from '@mantine/core';
import React from 'react';

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

const useStyles = createStyles((theme) => ({
    container: {
      position: 'relative',
      textAlign: 'center',
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      height: 60,
      width: 384,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderBottom: 'none',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      overflow: 'hidden',
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
      background: `linear-gradient(90deg, transparent, ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}, ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}, transparent)`,
      boxShadow: `0 0 20px ${theme.colors[theme.primaryColor][theme.fn.primaryShade()]}`, 
      borderRadius: '2px', 
      animation: `${horizontalPulse} 5s linear infinite`, 
      zIndex: 10, 
    },
}));

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Text className={classes.heading}>{title}</Text>
      <div className={classes.horizontalPulse} />
    </Box>
  );
};

export default React.memo(Header);
