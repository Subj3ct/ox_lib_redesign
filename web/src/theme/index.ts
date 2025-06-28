import { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  colorScheme: 'dark',
  fontFamily: 'Roboto',
  shadows: { 
    sm: '1px 1px 3px rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  components: {
    Button: {
      styles: {
        root: {
          border: 'none',
        },
      },
    },
  },
  other: {
    // Glassmorphism design tokens
    glass: {
      background: 'rgba(20, 20, 20, 0.8)',
      backgroundLight: 'rgba(30, 30, 30, 0.7)',
      border: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      backdropFilter: 'blur(16px)',
      shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    },
    animations: {
      // Smooth, professional animation durations
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Material Design easing
    },
  },
};
